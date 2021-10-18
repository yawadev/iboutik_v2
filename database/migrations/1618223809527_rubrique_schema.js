"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RubriqueSchema extends Schema {
    up() {
        this.create("rubriques", (table) => {
            table.increments();
            table.string("name", 255).notNullable();
            table.string("type", 255).notNullable();
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("status");
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("rubriques");
    }
}

module.exports = RubriqueSchema;