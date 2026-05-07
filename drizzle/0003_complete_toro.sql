CREATE TABLE "pedido_itens" (
	"id" text PRIMARY KEY NOT NULL,
	"pedidoId" text NOT NULL,
	"tipoIngressoId" text NOT NULL,
	"eventoId" text NOT NULL,
	"quantidade" integer DEFAULT 1 NOT NULL,
	"precoUnitario" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ingressos" ALTER COLUMN "criadoEm" SET DEFAULT '2026-05-07T18:34:11.594Z';--> statement-breakpoint
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_pedidoId_pedidos_id_fk" FOREIGN KEY ("pedidoId") REFERENCES "public"."pedidos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_tipoIngressoId_tipo_ingresso_id_fk" FOREIGN KEY ("tipoIngressoId") REFERENCES "public"."tipo_ingresso"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_eventoId_eventos_id_fk" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;