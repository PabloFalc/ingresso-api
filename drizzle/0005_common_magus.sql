ALTER TABLE "ingressos" RENAME COLUMN "pedidoId" TO "pedido_id";--> statement-breakpoint
ALTER TABLE "ingressos" RENAME COLUMN "eventoId" TO "evento_id";--> statement-breakpoint
ALTER TABLE "ingressos" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "tipo_ingresso" RENAME COLUMN "inicioVenda" TO "inicio_venda";--> statement-breakpoint
ALTER TABLE "tipo_ingresso" RENAME COLUMN "fimVenda" TO "fim_venda";--> statement-breakpoint
ALTER TABLE "pedidos" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "pedidos" RENAME COLUMN "quantidadeTotal" TO "quantidade_total";--> statement-breakpoint
ALTER TABLE "ingressos" DROP CONSTRAINT "ingressos_pedidoId_pedidos_id_fk";
--> statement-breakpoint
ALTER TABLE "ingressos" DROP CONSTRAINT "ingressos_eventoId_eventos_id_fk";
--> statement-breakpoint
ALTER TABLE "ingressos" DROP CONSTRAINT "ingressos_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tipo_ingresso" DROP CONSTRAINT "tipo_ingresso_evento_id_eventos_id_fk";
--> statement-breakpoint
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "ingressos" ALTER COLUMN "criadoEm" SET DEFAULT '2026-05-07T19:25:42.829Z';--> statement-breakpoint
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_pedido_id_pedidos_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tipo_ingresso" ADD CONSTRAINT "tipo_ingresso_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;