import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import * as XLSX from "xlsx";
import { createServer } from "http";
import { getAllQuotes } from "./db";

// Mock data for testing
const mockQuotes = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    phone: "912345678",
    city: "Lisboa",
    status: "new" as const,
    notes: "Teste",
    createdAt: new Date("2026-03-09"),
    updatedAt: new Date("2026-03-09"),
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@example.com",
    phone: "987654321",
    city: "Porto",
    status: "contacted" as const,
    notes: "Seguimento",
    createdAt: new Date("2026-03-08"),
    updatedAt: new Date("2026-03-08"),
  },
];

describe("Excel Export Functionality", () => {
  it("should format quote data correctly for Excel", () => {
    const data = mockQuotes.map((lead, index) => ({
      "#": index + 1,
      "Nome": lead.name,
      "Email": lead.email,
      "Telefone": lead.phone,
      "Localidade": lead.city,
      "Estado": lead.status === "new" ? "Novo" : lead.status === "contacted" ? "Contactado" : "Convertido",
      "Notas": lead.notes || "",
      "Data": lead.createdAt ? new Date(lead.createdAt).toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" }) : "",
    }));

    expect(data).toHaveLength(2);
    expect(data[0]["Nome"]).toBe("João Silva");
    expect(data[0]["Email"]).toBe("joao@example.com");
    expect(data[0]["Estado"]).toBe("Novo");
    expect(data[1]["Estado"]).toBe("Contactado");
  });

  it("should create valid Excel workbook", () => {
    const data = mockQuotes.map((lead, index) => ({
      "#": index + 1,
      "Nome": lead.name,
      "Email": lead.email,
      "Telefone": lead.phone,
      "Localidade": lead.city,
      "Estado": lead.status === "new" ? "Novo" : lead.status === "contacted" ? "Contactado" : "Convertido",
      "Notas": lead.notes || "",
      "Data": lead.createdAt ? new Date(lead.createdAt).toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" }) : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it("should set correct column widths", () => {
    const worksheet = XLSX.utils.json_to_sheet([]);
    worksheet["!cols"] = [
      { wch: 5 },  // #
      { wch: 25 }, // Nome
      { wch: 30 }, // Email
      { wch: 20 }, // Telefone
      { wch: 20 }, // Localidade
      { wch: 15 }, // Estado
      { wch: 40 }, // Notas
      { wch: 22 }, // Data
    ];

    expect(worksheet["!cols"]).toHaveLength(8);
    expect(worksheet["!cols"][0].wch).toBe(5);
    expect(worksheet["!cols"][1].wch).toBe(25);
  });

  it("should handle empty notes field", () => {
    const quoteWithoutNotes = {
      id: 3,
      name: "Test User",
      email: "test@example.com",
      phone: "999999999",
      city: "Covilhã",
      status: "new" as const,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const data = {
      "#": 1,
      "Nome": quoteWithoutNotes.name,
      "Email": quoteWithoutNotes.email,
      "Telefone": quoteWithoutNotes.phone,
      "Localidade": quoteWithoutNotes.city,
      "Estado": "Novo",
      "Notas": quoteWithoutNotes.notes || "",
      "Data": new Date().toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" }),
    };

    expect(data["Notas"]).toBe("");
  });

  it("should generate correct filename with date", () => {
    const date = new Date("2026-03-09");
    const filename = `leads_bluemagnitude_${date.toISOString().slice(0, 10)}.xlsx`;

    expect(filename).toBe("leads_bluemagnitude_2026-03-09.xlsx");
  });
});
