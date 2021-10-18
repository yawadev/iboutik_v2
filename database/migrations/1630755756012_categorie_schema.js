"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CategorieSchema extends Schema {
    up() {
        this.create("categories", (table) => {
            table.increments();
            table.string("name", 255);
            table.string("description", 255);
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("categories");
    }
}

module.exports = CategorieSchema;