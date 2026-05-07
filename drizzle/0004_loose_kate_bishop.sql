ALTER TABLE "tipo_ingresso" RENAME COLUMN "eventoId" TO "evento_id";--> statement-breakpoint
ALTER TABLE "tipo_ingresso" RENAME COLUMN "total" TO "quantidade_total";--> statement-breakpoint
ALTER TABLE "tipo_ingresso" RENAME COLUMN "quantidadeVendida" TO "quantidade_vendida";--> statement-breakpoint
ALTER TABLE "tipo_ingresso" DROP CONSTRAINT "tipo_ingresso_eventoId_eventos_id_fk";
--> statement-breakpoint
ALTER TABLE "ingressos" ALTER COLUMN "criadoEm" SET DEFAULT '2026-05-07T18:51:22.114Z';--> statement-breakpoint
ALTER TABLE "tipo_ingresso" ADD CONSTRAINT "tipo_ingresso_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;