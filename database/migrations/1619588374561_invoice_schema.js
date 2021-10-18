"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class InvoiceSchema extends Schema {
    up() {
        this.create("invoices", (table) => {
            table.increments();
            table.uuid("num_fac");
            table.string("categorie_fac", 255);
            table.string("categorie_client", 255);
            table.integer("client_id");
            table.string("client_name", 255);
            table.string("client_phone", 255);
            table.string("client_adresse", 255);
            table.string("client_email", 255);
            table.float("montant", 8, 2).defaultTo(0);
            table.float("remise", 8, 2).defaultTo(0);
            table.float("taxe", 8, 2).defaultTo(0);
            table.float("total", 8, 2).defaultTo(0);
            table.float("accompt", 8, 2).defaultTo(0);
            table.float("reliquat", 8, 2).defaultTo(0);
            table.string("date_echeance", 255);
            table.integer("vendeur_id");
            table.string("vendeur", 255);
            table.string("piece_jointe");
            table.string("note");
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("status").defaultTo(0);
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("invoices");
    }
}

module.exports = InvoiceSchema;