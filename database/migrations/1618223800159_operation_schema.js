"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OperationSchema extends Schema {
    up() {
        this.create("operations", (table) => {
            table.increments();
            table.uuid("num");
            table.integer("id_fac");
            table.integer("id_client");
            table.string("type", 255);
            table.integer("rub_id");
            table.string("motif", 255);
            table.float("montant", 8, 2);
            table.integer("caisse_id");
            table.string("caisse", 255);
            table.integer("caissier_id");
            table.string("caissier", 255);
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("status");
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("operations");
    }
}

module.exports = OperationSchema;