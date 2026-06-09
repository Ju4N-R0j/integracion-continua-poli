const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'mysql-container',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword',
  database: process.env.DB_NAME || 'integracion_db',
  port: 3306
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

app.get('/', (req, res) => {
  res.json({
    message: 'API de Integración Continua funcionando correctamente',
    project: 'IntegracionContinuaPoli',
    containers: ['api-container', 'mysql-container']
  });
});

app.get('/health', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT NOW() AS currentTime');
    await connection.end();

    res.json({
      status: 'OK',
      database: 'connected',
      currentTime: rows[0].currentTime
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: error.message
    });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM tasks');
    await connection.end();

    res.json({
      total: rows.length,
      tasks: rows
    });
  } catch (error) {
    res.status(500).json({
      error: 'No fue posible consultar las tareas',
      detail: error.message
    });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'El campo title es obligatorio'
      });
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO tasks (title) VALUES (?)',
      [title]
    );
    await connection.end();

    res.status(201).json({
      message: 'Tarea creada correctamente',
      taskId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      error: 'No fue posible crear la tarea',
      detail: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});