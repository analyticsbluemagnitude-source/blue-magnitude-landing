import { Resend } from 'resend';
import { createConnection } from 'mysql2/promise';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

const email = 'analytics.bluemagnitude@gmail.com';
const role = 'admin';

// Generate a secure token
const token = crypto.randomBytes(32).toString('hex');

// Set expiration to 30 days from now
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 30);

const inviteUrl = `https://bluemagnitudepage.pt/accept-invite/${token}`;

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #243fad 0%, #3ac6ff 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .cta-button { display: inline-block; background: #6cca7d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    .info-box { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #243fad; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🌞 Convite para Blue Magnitude</h1>
      <p style="margin: 10px 0 0 0;">Dashboard de Gestão</p>
    </div>
    <div class="content">
      <p>Olá,</p>
      
      <p>Foi convidado para aceder ao Dashboard de Gestão da Blue Magnitude com a função de <strong>Administrador</strong>.</p>
      
      <div class="info-box">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Função:</strong> Administrador</p>
        <p><strong>Validade do convite:</strong> 30 dias</p>
      </div>
      
      <p>Clique no botão abaixo para aceitar o convite e criar a sua conta:</p>
      
      <center>
        <a href="${inviteUrl}" class="cta-button">Aceitar Convite</a>
      </center>
      
      <p style="color: #666; font-size: 14px;">Ou copie e cole este link no seu navegador:</p>
      <p style="background: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
        ${inviteUrl}
      </p>
      
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        Se não solicitou este convite, pode ignorar este email.
      </p>
      
      <div class="footer">
        <p>Blue Magnitude - Energia Solar</p>
        <p>${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

try {
  // Create invite in database
  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blue_magnitude',
  });

  try {
    // Insert invite into database
    const query = `
      INSERT INTO invites (email, token, role, expiresAt, createdAt)
      VALUES (?, ?, ?, ?, NOW())
    `;
    
    await connection.execute(query, [
      email,
      token,
      role,
      expiresAt,
    ]);

    console.log('✅ Convite criado na base de dados com sucesso!');
    console.log(`Token: ${token}`);
    console.log(`Expira em: ${expiresAt.toLocaleString('pt-PT')}`);
  } finally {
    await connection.end();
  }

  // Send email
  const { data, error } = await resend.emails.send({
    from: 'Blue Magnitude <noreply@bluemagnitudepage.pt>',
    to: [email],
    subject: `🌞 Convite para Blue Magnitude Dashboard - Administrador`,
    html: htmlContent,
  });

  if (error) {
    console.error('❌ Erro ao enviar email de convite:', error);
    process.exit(1);
  }

  console.log('✅ Email de convite enviado com sucesso!');
  console.log(`ID do email: ${data?.id}`);
  console.log(`\n📋 Link do convite:\n${inviteUrl}`);
  process.exit(0);
} catch (error) {
  console.error('❌ Erro:', error);
  process.exit(1);
}
