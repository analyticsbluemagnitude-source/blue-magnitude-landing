import { describe, it, expect } from 'vitest';
import { sendQuoteEmail } from './email';

describe('Email Service', () => {
  it('should send quote email successfully with valid Resend API key', async () => {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+351 912 345 678',
      city: 'Lisboa',
    };

    const result = await sendQuoteEmail(testData);
    
    // Se a API key estiver configurada corretamente, deve retornar true
    expect(result).toBe(true);
  }, 15000); // 15 segundos de timeout para chamada de API externa
});
