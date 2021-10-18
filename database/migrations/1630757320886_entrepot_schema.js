"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class EntrepotSchema extends Schema {
    up() {
        this.create("entrepots", (table) => {
            table.increments();
            table.string("name", 255);
            table.string("adresse", 255);
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("entrepots");
    }
}

module.exports = EntrepotSchema;