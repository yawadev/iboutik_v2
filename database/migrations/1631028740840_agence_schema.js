"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AgenceSchema extends Schema {
    up() {
        this.create("agences", (table) => {
            table.increments();
            table.string("name", 255).notNullable();
            table.string("type", 255).notNullable();
            table.boolean("status").defaultTo(1);
            table.integer("compagny_id");
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("agences");
    }
}

module.exports = AgenceSchema;