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

const VALID_TYPES = ['curso-online', 'mentoria', 'corporate', 'lista_espera', 'interesse-cursos'];
const COURSE_CATALOG = Object.freeze({
  tendencias: { name: 'Tendências, Concorrência e Oportunidades', price: 199 },
  branding: { name: 'Branding, Posicionamento e Autoridade', price: 199 },
  redes_sociais: { name: 'Marketing e Estratégias de Crescimento em Redes Sociais', price: 199 },
  conformidade: { name: 'Conformidade Total: O Que Pode e Não Pode no Marketing Jurídico', price: 99 }
});
const COURSE_IDS = Object.freeze(Object.keys(COURSE_CATALOG));

app.post('/api/submissions', async (req, res) => {
  const { form_type, nome, whatsapp, email, selected_courses, source } = req.body;
  const cleanName = typeof nome === 'string' ? nome.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!form_type || !cleanName || !cleanEmail) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
  }

  if (!VALID_TYPES.includes(form_type)) {
    return res.status(400).json({ error: 'Tipo de formulário inválido.' });
  }

  if (form_type !== 'lista_espera' && !whatsapp) {
    if (form_type !== 'interesse-cursos') {
      return res.status(400).json({ error: 'Whatsapp é obrigatório.' });
    }
  }

  let courses = [];
  if (form_type === 'interesse-cursos') {
    if (!Array.isArray(selected_courses) || selected_courses.length === 0) {
      return res.status(400).json({ error: 'Selecione ao menos um curso.' });
    }

    courses = [...new Set(selected_courses)];
    if (courses.length === 0 || courses.some(course => typeof course !== 'string' || !COURSE_IDS.includes(course))) {
      return res.status(400).json({ error: 'A seleção de cursos é inválida.' });
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }

  const cleanSource = typeof source === 'string' ? source.trim().slice(0, 120) : null;

  try {
    await pool.query(
      `INSERT INTO submissions (form_type, nome, email, whatsapp, selected_courses, source)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [form_type, cleanName, cleanEmail, whatsapp || null, courses, cleanSource]
    );
  } catch (err) {
    console.error('Erro ao salvar no banco:', err);
    return res.status(500).json({ error: 'Erro ao salvar os dados. Tente novamente.' });
  }

  if (form_type !== 'interesse-cursos') {
    sendWelcomeEmail(cleanName, cleanEmail, form_type).catch(err => {
      console.error('Erro ao enviar email de boas-vindas:', err);
    });
  }

  res.status(201).json({
    success: true,
    message: 'Interesse registrado com sucesso!'
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
