import { describe, it, expect, beforeAll } from 'vitest';
import { createQuote, getAllQuotes, getQuoteById, updateQuoteStatus } from './db';

describe('Quotes Database Operations', () => {
  let testQuoteId: number;

  beforeAll(async () => {
    // Create a test quote
    const quote = await createQuote({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+351 912 345 678',
      city: 'Lisboa',
      status: 'new',
    });
    testQuoteId = quote.id;
  });

  it('should create a new quote', async () => {
    const quote = await createQuote({
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '+351 923 456 789',
      city: 'Porto',
      status: 'new',
    });

    expect(quote).toBeDefined();
    expect(quote.name).toBe('João Silva');
    expect(quote.email).toBe('joao@example.com');
    expect(quote.status).toBe('new');
  });

  it('should get all quotes', async () => {
    const quotes = await getAllQuotes();
    
    expect(Array.isArray(quotes)).toBe(true);
    expect(quotes.length).toBeGreaterThan(0);
  });

  it('should get quote by id', async () => {
    const quote = await getQuoteById(testQuoteId);
    
    expect(quote).toBeDefined();
    expect(quote?.id).toBe(testQuoteId);
    expect(quote?.name).toBe('Test User');
  });

  it('should update quote status', async () => {
    await updateQuoteStatus(testQuoteId, 'contacted', 'Cliente contactado por telefone');
    
    const updatedQuote = await getQuoteById(testQuoteId);
    expect(updatedQuote?.status).toBe('contacted');
    expect(updatedQuote?.notes).toBe('Cliente contactado por telefone');
  });
});
