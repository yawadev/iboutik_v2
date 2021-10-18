"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LivraisonSchema extends Schema {
    up() {
        this.create("livraisons", (table) => {
            table.increments();
            table.uuid("ref");
            table.integer("fac_id");
            table.integer("client_id");
            table.string("client_name", 255);
            table.string("client_phone", 255);
            table.string("client_adresse", 255);
            table.string("client_email", 255);
            table.float("qut_tot", 8, 2).defaultTo(0);
            table.float("qut_livre", 8, 2).defaultTo(0);
            table.float("qut_reste", 8, 2).defaultTo(0);
            table.string("date_livre", 255);
            table.string("livreur_name", 255);
            table.string("note");
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("status").defaultTo(0);
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("livraisons");
    }
}

module.exports = LivraisonSchema;