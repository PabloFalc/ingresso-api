ALTER TABLE "pedidos" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pedidos" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "eventos" ALTER COLUMN "data_inicio" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "eventos" ALTER COLUMN "data_fim" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "eventos" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "eventos" ALTER COLUMN "created_at" SET DEFAULT now();