const { Resend } = require('resend');

let connectionSettings = null;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error('Resend not connected');
  }

  return {
    apiKey: connectionSettings.settings.api_key,
    fromEmail: connectionSettings.settings.from_email
  };
}

async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const formTypeLabels = {
  'curso-online': 'Curso Online',
  'mentoria': 'Mentoria',
  'corporate': 'Corporate'
};

function buildEmailHtml(nome, formType) {
  const safeName = escapeHtml(nome);
  const label = formTypeLabels[formType] || escapeHtml(formType);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Inter',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:40px 40px 30px;text-align:center;">
              <h1 style="color:#c9a84c;margin:0;font-size:28px;font-weight:700;letter-spacing:1px;">Marketing Jur</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Marketing Estratégico para Advogados</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a2e;margin:0 0 20px;font-size:22px;">Olá, ${safeName}!</h2>
              <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 20px;">
                Sua inscrição para <strong style="color:#1a1a2e;">${label}</strong> foi recebida com sucesso!
              </p>
              <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 20px;">
                Estamos muito felizes em ter você conosco. Em breve, nossa equipe entrará em contato com mais informações e os próximos passos.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#f8f6f0;border-left:4px solid #c9a84c;padding:20px;border-radius:0 8px 8px 0;">
                    <p style="color:#1a1a2e;font-size:15px;margin:0;font-weight:600;">O que esperar:</p>
                    <ul style="color:#555;font-size:14px;line-height:1.8;margin:10px 0 0;padding-left:20px;">
                      <li>Confirmação detalhada por WhatsApp</li>
                      <li>Acesso ao material preparatório</li>
                      <li>Informações sobre datas e cronograma</li>
                    </ul>
                  </td>
                </tr>
              </table>
              <p style="color:#555;font-size:16px;line-height:1.6;margin:0;">
                Enquanto isso, fique à vontade para nos contatar caso tenha alguma dúvida.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f8f8;padding:30px 40px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#999;font-size:13px;margin:0;">
                Marketing Jur &mdash; Posicionamento estratégico dentro das regras da OAB
              </p>
              <p style="color:#bbb;font-size:12px;margin:8px 0 0;">
                Este é um email automático de confirmação de inscrição.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendWelcomeEmail(nome, email, formType) {
  console.log(`[Email] Iniciando envio para ${email}...`);

  const { client, fromEmail } = await getUncachableResendClient();
  const senderEmail = fromEmail || 'onboarding@resend.dev';

  console.log(`[Email] Remetente: ${senderEmail}`);

  const result = await client.emails.send({
    from: `Marketing Jur <${senderEmail}>`,
    to: [email],
    subject: 'Inscrição confirmada — Marketing Jur',
    html: buildEmailHtml(nome, formType)
  });

  console.log('[Email] Resultado do envio:', JSON.stringify(result));
  return result;
}

module.exports = { sendWelcomeEmail };
