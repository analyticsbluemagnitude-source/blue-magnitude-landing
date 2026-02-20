import { describe, it, expect, beforeAll } from 'vitest';
import { sendQuoteEmail } from './email';
import { createQuote, getAllQuotes } from './db';

describe('Quote Form Complete Flow', () => {
  const testQuoteData = {
    name: 'João Silva Teste',
    email: 'joao.teste@example.com',
    phone: '+351912345678',
    city: 'Lisboa'
  };

  it('should save quote to database', async () => {
    // Insert test quote
    const quote = await createQuote(testQuoteData);
    const quoteId = quote.id;
    
    expect(quoteId).toBeDefined();
    expect(typeof quoteId).toBe('number');
    
    // Verify it was saved
    const quotes = await getAllQuotes();
    const savedQuote = quotes.find(q => q.id === quoteId);
    
    expect(savedQuote).toBeDefined();
    expect(savedQuote?.name).toBe(testQuoteData.name);
    expect(savedQuote?.email).toBe(testQuoteData.email);
    expect(savedQuote?.phone).toBe(testQuoteData.phone);
    expect(savedQuote?.city).toBe(testQuoteData.city);
    expect(savedQuote?.status).toBe('new');
  });

  it('should send email with quote data', async () => {
    const result = await sendQuoteEmail(testQuoteData);
    
    // Should return true if email sent successfully
    expect(result).toBe(true);
  });

  it('should handle complete quote submission flow', async () => {
    // 1. Save to database
    const quote = await createQuote({
      name: 'Maria Costa Teste',
      email: 'maria.teste@example.com',
      phone: '+351923456789',
      city: 'Porto'
    });
    const quoteId = quote.id;
    
    expect(quoteId).toBeDefined();
    
    // 2. Send email
    const emailSent = await sendQuoteEmail({
      name: 'Maria Costa Teste',
      email: 'maria.teste@example.com',
      phone: '+351923456789',
      city: 'Porto'
    });
    
    expect(emailSent).toBe(true);
    
    // 3. Verify data in database
    const quotes = await getAllQuotes();
    const savedQuote = quotes.find(q => q.id === quoteId);
    
    expect(savedQuote).toBeDefined();
    expect(savedQuote?.name).toBe('Maria Costa Teste');
  });
});
