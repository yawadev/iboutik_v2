"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProfileSchema extends Schema {
    up() {
        this.create("profiles", (table) => {
            table.increments();
            table.string("user_id", 20).notNullable();
            table.string("name", 255);
            table.string("email", 254).notNullable().unique();
            table.string("sexe", 60).notNullable();
            table.string("cni", 254).notNullable().unique();
            table.string("adresse", 254).notNullable();
            table.string("avatar", 254);
            table.string("role", 254);
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("profiles");
    }
}

module.exports = ProfileSchema;