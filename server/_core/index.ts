import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import * as XLSX from "xlsx";
import { getAllQuotes } from "../db";
import { sdk } from "./sdk";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Export leads to Excel (protected route)
  app.get("/api/export/leads", async (req, res) => {
    try {
      // Verify authentication
      let user;
      try {
        user = await sdk.authenticateRequest(req);
      } catch {
        return res.status(401).json({ error: "Não autorizado" });
      }
      if (!user) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      // Verify admin role
      if (user.role !== "admin") {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem exportar leads." });
      }

      // Get all leads
      const leads = await getAllQuotes();

      // Build Excel data
      const data = leads.map((lead, index) => ({
        "#": index + 1,
        "Nome": lead.name,
        "Email": lead.email,
        "Telefone": lead.phone,
        "Localidade": lead.city,
        "Estado": lead.status === "new" ? "Novo" : lead.status === "contacted" ? "Contactado" : lead.status === "converted" ? "Convertido" : "Perdido",
        "Notas": lead.notes || "",
        "Data": lead.createdAt ? new Date(lead.createdAt).toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" }) : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);

      // Set column widths
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

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      const filename = `leads_bluemagnitude_${new Date().toISOString().slice(0, 10)}.xlsx`;
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.send(buffer);
    } catch (error) {
      console.error("Erro ao exportar leads:", error);
      res.status(500).json({ error: "Erro ao exportar leads" });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
