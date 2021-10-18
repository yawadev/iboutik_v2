"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CorbeilleSchema extends Schema {
    up() {
        this.create("corbeilles", (table) => {
            table.increments();
            table.integer("deleted_id");
            table.string("name", 255);
            table.string("description", 255);
            table.string("table", 255);
            table.integer("auteur_id");
            table.string("auteur_name");
            table.boolean("status").defaultTo(1);
            table.integer("compagny_id");
            table.timestamps();
        });
    }

    down() {
        this.drop("corbeilles");
    }
}

module.exports = CorbeilleSchema;