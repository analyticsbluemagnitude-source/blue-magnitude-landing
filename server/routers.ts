import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";
import { sendQuoteEmail } from "./email";
import { sendLeadEmail } from "./email-leads";
import { createQuote, getAllQuotes, getQuoteById, updateQuoteStatus, searchQuotes, createInvite, getInviteByToken, createLead, getAllLeads, getLeadById, updateLeadStatus } from "./db";
import { checkRateLimit } from "./rate-limit";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  forms: router({
    submitQuote: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome é obrigatório"),
          email: z.string().email("Email inválido"),
          phone: z.string().min(1, "Telefone é obrigatório"),
          city: z.string().min(1, "Localidade é obrigatória"),
        })
      )
      .mutation(async ({ input }) => {
        // Salvar na base de dados
        const quote = await createQuote({
          name: input.name,
          email: input.email,
          phone: input.phone,
          city: input.city,
          status: "new",
        });
        
        // Enviar email via Resend
        const emailSuccess = await sendQuoteEmail(input);
        
        // Criar convite automático para leads@bluemagnitude.pt se não existir
        try {
          // Verificar se já existe um convite válido para este email
          const existingInvites = await getAllQuotes(); // Placeholder - em produção seria melhor verificar na tabela invites
          // Por enquanto, sempre criar um novo convite (pode ser melhorado depois)
          try {
            const invite = await createInvite("leads@bluemagnitude.pt", "admin");
            console.log(`Convite criado/atualizado para leads@bluemagnitude.pt: ${invite.token}`);
          } catch (inviteError: any) {
            // Ignorar erro de duplicate entry - o convite já existe
            if (inviteError?.message?.includes("Duplicate")) {
              console.log("Convite para leads@bluemagnitude.pt já existe");
            } else {
              throw inviteError;
            }
          }
        } catch (error) {
          console.error("Erro ao criar convite automático:", error);
        }
        
        // Enviar notificação ao proprietário (Manus Dashboard)
        const emailContent = `
**Novo Pedido de Orçamento - Blue Magnitude**

**Nome:** ${input.name}
**Email:** ${input.email}
**Telefone:** ${input.phone}
**Localidade:** ${input.city}

---
Enviado através do formulário de orçamento do site.
        `.trim();

        const notifySuccess = await notifyOwner({
          title: `Novo Pedido de Orçamento: ${input.name}`,
          content: emailContent,
        });

        // Retorna sucesso se pelo menos um método funcionou
        if (!emailSuccess && !notifySuccess) {
          throw new Error("Falha ao enviar notificação. Por favor, tente novamente.");
        }

        return { success: true, quoteId: quote.id };
      }),

    submitContact: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome é obrigatório"),
          email: z.string().email("Email inválido"),
          phone: z.string().min(1, "Telefone é obrigatório"),
          city: z.string().min(1, "Localidade é obrigatória"),
        })
      )
      .mutation(async ({ input }) => {
        // Enviar notificação ao proprietário
        const emailContent = `
**Novo Contacto - Blue Magnitude**

**Nome:** ${input.name}
**Email:** ${input.email}
**Telefone:** ${input.phone}
**Localidade:** ${input.city}

---
Enviado através do formulário de contacto do site.
        `.trim();

        const success = await notifyOwner({
          title: `Novo Contacto: ${input.name}`,
          content: emailContent,
        });

        if (!success) {
          throw new Error("Falha ao enviar notificação. Por favor, tente novamente.");
        }

        return { success: true };
      }),

    submitLead: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome é obrigatório"),
          email: z.string().email("Email inválido"),
          phone: z.string().min(1, "Telefone é obrigatório"),
          district: z.string().min(1, "Distrito é obrigatório"),
          message: z.string().min(1, "Mensagem é obrigatória"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Salvar na base de dados
        const lead = await createLead({
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: input.message,
          status: "new",
          district: input.district,
        });
        
        // Enviar email para leads@bluemagnitude.pt
        const emailSuccess = await sendLeadEmail(input);
        
        if (!emailSuccess) {
          console.warn("Aviso: Email de lead não foi enviado, mas o lead foi salvo na base de dados");
        }

        return { success: true, leadId: lead.id };
      }),
  }),

  invites: router({
    create: protectedProcedure
      .input(
        z.object({
          email: z.string().email("Email inválido"),
          role: z.enum(["user", "admin"]).default("admin"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Only admins can create invites
        if (ctx.user?.role !== "admin") {
          throw new Error("Apenas administradores podem criar convites");
        }

        const invite = await createInvite(input.email, input.role);
        return {
          success: true,
          inviteUrl: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/accept-invite/${invite.token}`,
          email: invite.email,
        };
      }),
  }),

  quotes: router({
    list: protectedProcedure.query(async () => {
      return await getAllQuotes();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getQuoteById(input.id);
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "contacted", "converted", "archived"]),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await updateQuoteStatus(input.id, input.status, input.notes);
        return { success: true };
      }),

    search: protectedProcedure
      .input(z.object({ term: z.string() }))
      .query(async ({ input }) => {
        return await searchQuotes(input.term);
      }),
  }),
});

export type AppRouter = typeof appRouter;
