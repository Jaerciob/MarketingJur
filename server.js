const express = require('express');
const path = require('path');
const { sendWelcomeEmail } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

  sendWelcomeEmail(nome, email, form_type).catch(err => {
    console.error('Erro ao enviar email de boas-vindas:', err);
  });

  res.status(201).json({
    success: true,
    message: 'Inscrição realizada com sucesso!'
  });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
