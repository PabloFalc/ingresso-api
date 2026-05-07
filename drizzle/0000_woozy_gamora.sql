CREATE TYPE "public"."ingresso_status" AS ENUM('VALIDO', 'USADO', 'CANCELADO');--> statement-breakpoint
CREATE TYPE "public"."pedido_status" AS ENUM('PENDENTE', 'PAGO', 'CANCELADO');--> statement-breakpoint
CREATE TYPE "public"."status_evento" AS ENUM('RASCUNHO', 'PUBLICADO', 'CANCELADO');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"user_name" varchar(14) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone,
	CONSTRAINT "users_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingressos" (
	"id" text PRIMARY KEY NOT NULL,
	"pedidoId" text NOT NULL,
	"eventoId" text NOT NULL,
	"userId" text NOT NULL,
	"status" "ingresso_status" DEFAULT 'VALIDO' NOT NULL,
	"criadoEm" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tipo_ingresso" (
	"id" text PRIMARY KEY NOT NULL,
	"eventoId" text NOT NULL,
	"nome" varchar(150) NOT NULL,
	"preco" integer DEFAULT 0 NOT NULL,
	"total" integer NOT NULL,
	"quantidadeVendida" integer NOT NULL,
	"inicioVenda" timestamp NOT NULL,
	"fimVenda" timestamp NOT NULL,
	"ativo" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pedidos" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"quantidadeTotal" integer DEFAULT 1 NOT NULL,
	"status" "pedido_status" DEFAULT 'PENDENTE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" text PRIMARY KEY NOT NULL,
	"titulo" varchar(150) NOT NULL,
	"descricao" text,
	"data_inicio" timestamp NOT NULL,
	"data_fim" timestamp NOT NULL,
	"status" "status_evento" DEFAULT 'RASCUNHO',
	"local" varchar NOT NULL,
	"organizadorId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "address" (
	"adress_id" text PRIMARY KEY NOT NULL,
	"street_address" varchar(100) NOT NULL,
	"zip_code" varchar(9) NOT NULL,
	"number" integer NOT NULL,
	"addition" varchar,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_pedidoId_pedidos_id_fk" FOREIGN KEY ("pedidoId") REFERENCES "public"."pedidos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_eventoId_eventos_id_fk" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tipo_ingresso" ADD CONSTRAINT "tipo_ingresso_eventoId_eventos_id_fk" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_organizadorId_users_id_fk" FOREIGN KEY ("organizadorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_users_name" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "users_created_at" ON "users" USING btree ("criado_em");--> statement-breakpoint
CREATE INDEX "users_updated_at" ON "users" USING btree ("atualizado_em");--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");