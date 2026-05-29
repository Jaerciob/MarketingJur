const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const { sendWelcomeEmail } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname), {
  index: 'index.html'
}));

const VALID_TYPES = ['curso-online', 'mentoria', 'corporate', 'lista_espera'];

app.post('/api/submissions', async (req, res) => {
  const { form_type, nome, whatsapp, email } = req.body;

  if (!form_type || !nome || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
  }

  if (!VALID_TYPES.includes(form_type)) {
    return res.status(400).json({ error: 'Tipo de formulário inválido.' });
  }

  if (form_type !== 'lista_espera' && !whatsapp) {
    return res.status(400).json({ error: 'Whatsapp é obrigatório.' });
  }

  try {
    await pool.query(
      'INSERT INTO submissions (form_type, nome, email, whatsapp) VALUES ($1, $2, $3, $4)',
      [form_type, nome, email, whatsapp || null]
    );
  } catch (err) {
    console.error('Erro ao salvar no banco:', err);
    return res.status(500).json({ error: 'Erro ao salvar os dados. Tente novamente.' });
  }

  sendWelcomeEmail(nome, email, form_type).catch(err => {
    console.error('Erro ao enviar email de boas-vindas:', err);
  });

  res.status(201).json({
    success: true,
    message: 'Inscrição realizada com sucesso!'
  });
});

app.get('/ferramentas', (req, res) => {
  res.sendFile(path.join(__dirname, 'ferramentas.html'));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
