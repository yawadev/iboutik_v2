"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FournisseurSchema extends Schema {
    up() {
        this.create("fournisseurs", (table) => {
            table.increments();
            table.string("type", 255).notNullable();
            table.string("name", 255).notNullable();
            table.string("adresse", 254);
            table.string("contact_name", 254).notNullable();
            table.string("contact_phone", 254).notNullable();
            table.string("contact_post", 254);
            table.string("img", 255).defaultTo("assets/images/logo/logo.png");
            table.boolean("status").defaultTo(1);
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("fournisseurs");
    }
}

module.exports = FournisseurSchema;