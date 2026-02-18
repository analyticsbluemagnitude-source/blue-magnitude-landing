import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as notification from "./_core/notification";

// Mock da função notifyOwner
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("forms.submitQuote", () => {
  it("envia notificação com dados do formulário de orçamento", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Mock notifyOwner para retornar sucesso
    vi.mocked(notification.notifyOwner).mockResolvedValue(true);

    const formData = {
      name: "João Silva",
      email: "joao@example.com",
      phone: "+351 912 345 678",
      city: "Lisboa",
    };

    const result = await caller.forms.submitQuote(formData);

    expect(result).toEqual({ success: true });
    expect(notification.notifyOwner).toHaveBeenCalledWith({
      title: "Novo Pedido de Orçamento: João Silva",
      content: expect.stringContaining("João Silva"),
    });
    expect(notification.notifyOwner).toHaveBeenCalledWith({
      title: expect.any(String),
      content: expect.stringContaining("joao@example.com"),
    });
    expect(notification.notifyOwner).toHaveBeenCalledWith({
      title: expect.any(String),
      content: expect.stringContaining("+351 912 345 678"),
    });
    expect(notification.notifyOwner).toHaveBeenCalledWith({
      title: expect.any(String),
      content: expect.stringContaining("Lisboa"),
    });
  });

  it("lança erro quando notificação falha", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Mock notifyOwner para retornar falha
    vi.mocked(notification.notifyOwner).mockResolvedValue(false);

    const formData = {
      name: "Maria Costa",
      email: "maria@example.com",
      phone: "+351 987 654 321",
      city: "Porto",
    };

    await expect(caller.forms.submitQuote(formData)).rejects.toThrow(
      "Falha ao enviar notificação"
    );
  });

  it("valida campos obrigatórios", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Testa nome vazio
    await expect(
      caller.forms.submitQuote({
        name: "",
        email: "test@example.com",
        phone: "+351 912 345 678",
        city: "Lisboa",
      })
    ).rejects.toThrow();

    // Testa email inválido
    await expect(
      caller.forms.submitQuote({
        name: "João Silva",
        email: "email-invalido",
        phone: "+351 912 345 678",
        city: "Lisboa",
      })
    ).rejects.toThrow();
  });
});

describe("forms.submitContact", () => {
  it("envia notificação com dados do formulário de contacto", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Mock notifyOwner para retornar sucesso
    vi.mocked(notification.notifyOwner).mockResolvedValue(true);

    const formData = {
      name: "Ana Pereira",
      email: "ana@example.com",
      phone: "+351 911 222 333",
      city: "Coimbra",
    };

    const result = await caller.forms.submitContact(formData);

    expect(result).toEqual({ success: true });
    expect(notification.notifyOwner).toHaveBeenCalledWith({
      title: "Novo Contacto: Ana Pereira",
      content: expect.stringContaining("Ana Pereira"),
    });
  });
});
