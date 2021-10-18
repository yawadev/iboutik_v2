"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RoleSchema extends Schema {
    up() {
        this.create("roles", (table) => {
            table.increments();
            table.string("name", 255);
            table.string("code", 255);
            table.string("description", 255);
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("roles");
    }
}

module.exports = RoleSchema;