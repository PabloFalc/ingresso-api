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
