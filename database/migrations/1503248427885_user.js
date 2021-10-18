"use strict";

const Schema = use("Schema");

class UserSchema extends Schema {
    up() {
        this.create("users", (table) => {
            table.increments();
            table.string("name", 255).notNullable();
            table.string("username", 80).notNullable().unique();
            table.string("email", 254).notNullable().unique();
            table.string("password", 60).notNullable();
            table.integer("role_id");
            table.integer("role_name");
            table.string("compagny", 200);
            table.integer("agence_id");
            table.integer("compagny_id");
            table.boolean("is_activated").defaultTo(1);
            table.boolean("is_deleted").defaultTo(0);
            table.boolean("is_log").defaultTo(0);
            table.string("sexe");
            table.string("avatar").defaultTo("/assets/images/logo/logo.png");
            table.string("phone");
            table.timestamps([useTimestamps], [defaultToNow]);
        });
    }

    down() {
        this.drop("users");
    }
}

module.exports = UserSchema;