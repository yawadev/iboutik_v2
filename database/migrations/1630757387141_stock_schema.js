"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StockSchema extends Schema {
    up() {
        this.create("stocks", (table) => {
            table.increments();
            table.integer("art_id");
            table.string("art_name", 255);
            table.string("art_unite", 255);
            table.integer("entrepot_id");
            table.string("entrepot_name", 255);
            table.float("prix_achat", 8, 2).defaultTo(0);
            table.float("prix_vente", 8, 2).defaultTo(0);
            table.integer("taxe").defaultTo(18);
            table.float("marge", 8, 2).defaultTo(0);
            table.float("qut", 8, 2).defaultTo(0.0);
            table.boolean("status").defaultTo(1);
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("stocks");
    }
}

module.exports = StockSchema;