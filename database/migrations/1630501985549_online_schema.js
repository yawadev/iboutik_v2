"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OnlineSchema extends Schema {
    up() {
        this.create("onlines", (table) => {
            table.increments();
            table.integer("user_id");
            table.string("ip", 255);
            table.string("username", 255);
            table.string("role", 255);
            table.integer("compagny_id");
            table.boolean("status").defaultTo(0);
            table.timestamps();
        });
    }

    down() {
        this.drop("onlines");
    }
}

module.exports = OnlineSchema;