import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInviteEmailParams {
  email: string;
  token: string;
  role: "user" | "admin";
}

export async function sendInviteEmail(params: SendInviteEmailParams): Promise<boolean> {
  try {
    const { email, token, role } = params;
    
    // Construir URL de aceitação do convite
    const inviteUrl = `${process.env.VITE_FRONTEND_URL || 'https://bluemagnitudepage.pt'}/accept-invite?token=${token}`;
    
    const roleLabel = role === 'admin' ? 'Administrador' : 'Utilizador';

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
      
      <p>Foi convidado para aceder ao Dashboard de Gestão da Blue Magnitude com a função de <strong>${roleLabel}</strong>.</p>
      
      <div class="info-box">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Função:</strong> ${roleLabel}</p>
        <p><strong>Validade do convite:</strong> 7 dias</p>
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
    `.trim();

    const { data, error } = await resend.emails.send({
      from: 'Blue Magnitude <noreply@bluemagnitudepage.pt>',
      to: [email],
      subject: `🌞 Convite para Blue Magnitude Dashboard - ${roleLabel}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Erro ao enviar email de convite:', error);
      return false;
    }

    console.log('Email de convite enviado com sucesso:', data);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de convite:', error);
    return false;
  }
}
