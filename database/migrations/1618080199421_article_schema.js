"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArticleSchema extends Schema {
    up() {
        this.create("articles", (table) => {
            table.increments();
            table.uuid("qrCode");
            table.string("name", 255).notNullable().unique();
            table.string("type", 255);
            table.integer("categorie_id");
            table.string("categorie_name", 255);
            table.boolean("en_achat").defaultTo(1);
            table.boolean("en_vente").defaultTo(1);
            table.string("unite_mesure", 255);
            table.string("img", 255).defaultTo("assets/images/logo/logo.png");
            table.boolean("status").defaultTo(1);
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("articles");
    }
}

module.exports = ArticleSchema;