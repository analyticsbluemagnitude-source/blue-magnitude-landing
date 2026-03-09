import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendQuoteEmailParams {
  name: string;
  email: string;
  phone: string;
  city: string;
}

export async function sendQuoteEmail(params: SendQuoteEmailParams): Promise<boolean> {
  try {
    const { name, email, phone, city } = params;

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
    .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #6cca7d; }
    .label { font-weight: bold; color: #243fad; margin-bottom: 5px; }
    .value { color: #333; font-size: 16px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🌞 Novo Pedido de Orçamento</h1>
      <p style="margin: 10px 0 0 0;">Blue Magnitude - Energia Solar</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">👤 Nome:</div>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">📧 Email:</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>
      <div class="field">
        <div class="label">📱 Telefone:</div>
        <div class="value"><a href="tel:${phone}">${phone}</a></div>
      </div>
      <div class="field">
        <div class="label">📍 Localidade:</div>
        <div class="value">${city}</div>
      </div>
      <div class="footer">
        <p>Enviado através do formulário de orçamento do site Blue Magnitude</p>
        <p>${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    const { data, error } = await resend.emails.send({
      from: 'Blue Magnitude <onboarding@resend.dev>',
      to: ['leads@bluemagnitude.pt'],
      subject: `🌞 Novo Pedido de Orçamento: ${name}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }

    console.log('Email enviado com sucesso:', data);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}
