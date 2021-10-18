"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MainEntrepriseSchema extends Schema {
    up() {
        this.create("main_entreprises", (table) => {
            table.increments();
            table.string("type", 255);
            table.string("categorie", 255);
            table.string("name", 255).notNullable().unique();
            table.string("ninea", 255);
            table.string("email", 255);
            table.string("phone", 255);
            table.string("adress", 255);
            table.string("website", 255);
            table.string("ville", 255);
            table.string("logo", 255).defaultTo("assets/images/logo/logo.png");
            table.string("contact_name", 254).notNullable();
            table.string("contact_phone", 254).notNullable();
            table.string("contact_email", 254).notNullable();
            table.string("contact_post", 254);
            table.boolean("status").defaultTo(1);
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("main_entreprises");
    }
}

module.exports = MainEntrepriseSchema;