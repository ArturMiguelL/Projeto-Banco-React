CREATE TABLE "extrato" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"destino_id" integer,
	"valor" numeric(10, 2),
	"descricao" text,
	"tipo" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"data_de_nascimento" text,
	"saldo" numeric(10, 2) DEFAULT '0',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "extrato" ADD CONSTRAINT "extrato_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extrato" ADD CONSTRAINT "extrato_destino_id_users_id_fk" FOREIGN KEY ("destino_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;