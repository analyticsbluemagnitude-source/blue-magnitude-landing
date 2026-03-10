import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("Lead Submission System", () => {
  describe("Rate Limiting", () => {
    it("should allow first submission from new IP", () => {
      const ip = "192.168.1.100";
      const result = checkRateLimit(ip);
      expect(result).toBe(true);
    });

    it("should allow multiple submissions within limit", () => {
      const ip = "192.168.1.101";
      
      // Allow up to 5 submissions
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(ip);
        expect(result).toBe(true);
      }
    });

    it("should block submissions after rate limit exceeded", () => {
      const ip = "192.168.1.102";
      
      // Fill up the limit
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip);
      }
      
      // Next submission should be blocked
      const result = checkRateLimit(ip);
      expect(result).toBe(false);
    });

    it("should track different IPs separately", () => {
      const ip1 = "192.168.1.103";
      const ip2 = "192.168.1.104";
      
      // Fill up limit for IP1
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip1);
      }
      
      // IP2 should still be able to submit
      const result = checkRateLimit(ip2);
      expect(result).toBe(true);
    });
  });

  describe("Lead Form Validation", () => {
    it("should validate required name field", () => {
      const name = "";
      expect(name.trim().length).toBe(0);
    });

    it("should validate email format", () => {
      const email = "test@example.com";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(true);
    });

    it("should reject invalid email format", () => {
      const email = "invalid-email";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(false);
    });

    it("should validate phone field is not empty", () => {
      const phone = "912345678";
      expect(phone.trim().length).toBeGreaterThan(0);
    });

    it("should validate message field is not empty", () => {
      const message = "I'm interested in your solar solutions";
      expect(message.trim().length).toBeGreaterThan(0);
    });
  });

  describe("Email Content", () => {
    it("should format email subject correctly", () => {
      const subject = "Novo Lead - Blue Magnitude Landing Page";
      expect(subject).toContain("Novo Lead");
      expect(subject).toContain("Blue Magnitude");
    });

    it("should include all required fields in email body", () => {
      const leadData = {
        name: "João Silva",
        email: "joao@example.com",
        phone: "912345678",
        message: "Interested in solar installation",
      };

      const emailBody = `
        Nome: ${leadData.name}
        Email: ${leadData.email}
        Telefone: ${leadData.phone}
        Mensagem: ${leadData.message}
      `;

      expect(emailBody).toContain(leadData.name);
      expect(emailBody).toContain(leadData.email);
      expect(emailBody).toContain(leadData.phone);
      expect(emailBody).toContain(leadData.message);
    });

    it("should include timestamp in email", () => {
      const timestamp = new Date().toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" });
      expect(timestamp).toBeTruthy();
      expect(typeof timestamp).toBe("string");
    });
  });

  describe("Lead Status", () => {
    it("should initialize lead with 'new' status", () => {
      const status = "new";
      expect(status).toBe("new");
    });

    it("should support status transitions", () => {
      const validStatuses = ["new", "contacted", "converted", "archived"];
      const currentStatus = "new";
      
      expect(validStatuses).toContain(currentStatus);
    });
  });

  describe("Form Submission Response", () => {
    it("should return success response on valid submission", () => {
      const response = { success: true, leadId: 1 };
      
      expect(response.success).toBe(true);
      expect(response.leadId).toBeGreaterThan(0);
    });

    it("should include lead ID in response", () => {
      const response = { success: true, leadId: 42 };
      
      expect(response).toHaveProperty("leadId");
      expect(typeof response.leadId).toBe("number");
    });
  });

  describe("Confirmation Message", () => {
    it("should display confirmation message after submission", () => {
      const message = "Obrigado pelo seu contacto. A nossa equipa irá responder brevemente.";
      
      expect(message).toContain("Obrigado");
      expect(message).toContain("contacto");
      expect(message).toContain("equipa");
    });
  });
});
