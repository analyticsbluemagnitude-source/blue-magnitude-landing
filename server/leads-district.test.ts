import { describe, it, expect } from "vitest";
import { createLead } from "./db";

describe("Leads with District", () => {
  it("should create a lead with district field", async () => {
    const leadData = {
      name: "João Silva",
      email: "joao@example.com",
      phone: "912345678",
      message: "Quero uma proposta de energia solar",
      status: "new" as const,
      district: "Porto",
    };

    const lead = await createLead(leadData);

    expect(lead).toBeDefined();
    expect(lead.name).toBe("João Silva");
    expect(lead.email).toBe("joao@example.com");
    expect(lead.phone).toBe("912345678");
    expect(lead.district).toBe("Porto");
    expect(lead.message).toBe("Quero uma proposta de energia solar");
    expect(lead.status).toBe("new");
  });

  it("should validate district field is required", async () => {
    const leadData = {
      name: "Maria Costa",
      email: "maria@example.com",
      phone: "987654321",
      message: "Interessada em energia solar",
      status: "new" as const,
      district: "Lisboa",
    };

    const lead = await createLead(leadData);

    expect(lead.district).toBe("Lisboa");
    expect(lead.district).not.toBeNull();
    expect(lead.district).not.toBe("");
  });

  it("should accept all Portuguese districts", async () => {
    const districts = [
      "Aveiro",
      "Beja",
      "Braga",
      "Bragança",
      "Castelo Branco",
      "Coimbra",
      "Évora",
      "Faro",
      "Guarda",
      "Leiria",
      "Lisboa",
      "Portalegre",
      "Porto",
      "Santarém",
      "Setúbal",
      "Viana do Castelo",
      "Vila Real",
      "Viseu",
    ];

    for (const district of districts) {
      const leadData = {
        name: `Lead ${district}`,
        email: `lead-${district.toLowerCase()}@example.com`,
        phone: "912345678",
        message: "Teste",
        status: "new" as const,
        district: district,
      };

      const lead = await createLead(leadData);
      expect(lead.district).toBe(district);
    }
  });
});
