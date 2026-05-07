ALTER TABLE "users" ALTER COLUMN "criado_em" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "criado_em" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ingressos" ALTER COLUMN "criadoEm" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ingressos" ALTER COLUMN "criadoEm" SET DEFAULT '2026-05-07T18:32:16.097Z';--> statement-breakpoint
ALTER TABLE "tipo_ingresso" ALTER COLUMN "quantidadeVendida" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "tipo_ingresso" ALTER COLUMN "inicioVenda" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tipo_ingresso" ALTER COLUMN "fimVenda" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pedidos" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "pedidos" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "eventos" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "eventos" ALTER COLUMN "created_at" SET DEFAULT now();