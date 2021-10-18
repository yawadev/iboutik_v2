"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class InvoiceItemSchema extends Schema {
    up() {
        this.create("invoice_items", (table) => {
            table.increments();
            table.string("type");
            table.integer("fac_id");
            table.integer("fourn_id");
            table.integer("client_id");
            table.integer("art_id");
            table.integer("art_name");
            table.integer("art_unite");
            table.float("art_qut", 8, 2).defaultTo(0);
            table.float("art_prix", 8, 2).defaultTo(0);
            table.float("art_montant", 8, 2).defaultTo(0);
            table.boolean("status").defaultTo(0);
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("invoice_items");
    }
}

module.exports = InvoiceItemSchema;