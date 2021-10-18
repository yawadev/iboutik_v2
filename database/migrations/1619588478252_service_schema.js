"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ServiceSchema extends Schema {
    up() {
        this.create("services", (table) => {
            table.increments();
            table.uuid("service_num");
            table.integer("user_id");
            table.string("user_name", 255);
            table.string("debut_service", 255);
            table.string("fin_service", 255);
            table.string("date_service", 255);
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("etat_service").defaultTo(1);
            table.boolean("is_deleted").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("services");
    }
}

module.exports = ServiceSchema;