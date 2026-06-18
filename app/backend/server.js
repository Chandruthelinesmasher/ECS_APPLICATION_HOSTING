const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection pool — DATABASE_URL is injected by ECS from Secrets Manager
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create tasks table and seed default rows on first run
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id         SERIAL PRIMARY KEY,
      title      TEXT    NOT NULL,
      completed  BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const { rows } = await pool.query('SELECT COUNT(*) FROM tasks');
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO tasks (title, completed) VALUES
        ('Initialize VPC and Subnets via Terraform', true),
        ('Create ECS Fargate Cluster', true),
        ('Deploy React frontend and Node.js backend', false),
        ('Configure Application Load Balancer path routing', false)
    `);
  }
}

app.use(cors());
app.use(express.json());

const startTime = Date.now();

// Health / system info
app.get('/api/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptimeSeconds / 60)}m ${uptimeSeconds % 60}s`,
    system: {
      platform: os.platform(),
      release: os.release(),
      totalMemory: `${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`,
      freeMemory: `${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)} GB`,
      nodeVersion: process.version
    }
  });
});

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id::text, title, completed FROM tasks ORDER BY created_at'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/tasks error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new task
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, completed) VALUES ($1, false) RETURNING id::text, title, completed',
      [title.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /api/tasks error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT toggle task completed
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING id::text, title, completed',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /api/tasks/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id::text, title, completed',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('DELETE /api/tasks/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve the built React frontend
// Docker image layout: backend -> /usr/src/app, frontend dist -> /usr/src/frontend/dist
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Connect to DB, then start the HTTP server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=============================================`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
