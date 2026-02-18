import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";

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
        // Enviar notificação ao proprietário
        const emailContent = `
**Novo Pedido de Orçamento - Blue Magnitude**

**Nome:** ${input.name}
**Email:** ${input.email}
**Telefone:** ${input.phone}
**Localidade:** ${input.city}

---
Enviado através do formulário de orçamento do site.
        `.trim();

        const success = await notifyOwner({
          title: `Novo Pedido de Orçamento: ${input.name}`,
          content: emailContent,
        });

        if (!success) {
          throw new Error("Falha ao enviar notificação. Por favor, tente novamente.");
        }

        return { success: true };
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
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
