ALTER TABLE "pedidos" RENAME COLUMN "created_at" TO "criado_em";--> statement-breakpoint
ALTER TABLE "pedidos" RENAME COLUMN "updated_at" TO "atualizado_em";--> statement-breakpoint
ALTER TABLE "ingressos" ALTER COLUMN "criadoEm" SET DEFAULT '2026-05-07T19:31:23.669Z';