ALTER TABLE "eventos" RENAME COLUMN "organizadorId" TO "organizador_id";--> statement-breakpoint
ALTER TABLE "pedido_itens" RENAME COLUMN "pedidoId" TO "pedido_id";--> statement-breakpoint
ALTER TABLE "pedido_itens" RENAME COLUMN "tipoIngressoId" TO "tipo_ingresso_id";--> statement-breakpoint
ALTER TABLE "pedido_itens" RENAME COLUMN "eventoId" TO "evento_id";--> statement-breakpoint
ALTER TABLE "pedido_itens" RENAME COLUMN "precoUnitario" TO "preco_unitario";--> statement-breakpoint
ALTER TABLE "eventos" DROP CONSTRAINT "eventos_organizadorId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "pedido_itens" DROP CONSTRAINT "pedido_itens_pedidoId_pedidos_id_fk";
--> statement-breakpoint
ALTER TABLE "pedido_itens" DROP CONSTRAINT "pedido_itens_tipoIngressoId_tipo_ingresso_id_fk";
--> statement-breakpoint
ALTER TABLE "pedido_itens" DROP CONSTRAINT "pedido_itens_eventoId_eventos_id_fk";
--> statement-breakpoint
ALTER TABLE "ingressos" ALTER COLUMN "criadoEm" SET DEFAULT '2026-05-07T19:43:43.740Z';--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_organizador_id_users_id_fk" FOREIGN KEY ("organizador_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_pedido_id_pedidos_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_tipo_ingresso_id_tipo_ingresso_id_fk" FOREIGN KEY ("tipo_ingresso_id") REFERENCES "public"."tipo_ingresso"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;