ALTER TABLE "ingressos" DROP CONSTRAINT "ingressos_pedido_id_pedidos_id_fk";
--> statement-breakpoint
ALTER TABLE "ingressos" DROP CONSTRAINT "ingressos_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "ingressos" ALTER COLUMN "pedido_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ingressos" ALTER COLUMN "criadoEm" SET DEFAULT '2026-05-07T19:37:44.820Z';--> statement-breakpoint
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_pedido_id_pedidos_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;