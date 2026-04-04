import { pgTable, serial, text, decimal, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    nome: text("nome").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(), // armazene sempre o hash aqui
    data_de_nascimento: text("data_de_nascimento"),
    saldo: decimal("saldo", { precision: 10, scale: 2 }).default("0"),
});

export const extrato = pgTable("extrato", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.id),
    destino_id: integer("destino_id").references(() => users.id),
    valor: decimal("valor", { precision: 10, scale: 2 }),
    descricao: text("descricao"),
    tipo: text("tipo"),
    created_at: timestamp("created_at").defaultNow(),
});