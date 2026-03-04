const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS form_submissions (
        id SERIAL PRIMARY KEY,
        form_type VARCHAR(50) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(30) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON form_submissions(form_type)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC)');
    console.log('Banco de dados inicializado com sucesso.');
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err);
    process.exit(1);
  }
}

initDatabase();

app.use(express.static(path.join(__dirname), {
  index: 'index.html'
}));

app.post('/api/submissions', async (req, res) => {
  const { form_type, nome, whatsapp, email } = req.body;

  if (!form_type || !nome || !whatsapp || !email) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const validTypes = ['curso-online', 'mentoria', 'corporate'];
  if (!validTypes.includes(form_type)) {
    return res.status(400).json({ error: 'Tipo de formulário inválido.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO form_submissions (form_type, nome, whatsapp, email) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
      [form_type, nome, whatsapp, email]
    );
    res.status(201).json({
      success: true,
      message: 'Inscrição realizada com sucesso!',
      id: result.rows[0].id,
      created_at: result.rows[0].created_at
    });
  } catch (err) {
    console.error('Erro ao salvar submissão:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.get('/api/submissions', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }
  const { form_type } = req.query;
  try {
    let query = 'SELECT * FROM form_submissions';
    const params = [];
    if (form_type) {
      query += ' WHERE form_type = $1';
      params.push(form_type);
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar submissões:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
