"use strict";

const User = use("App/Models/User");
const Role = use("App/Models/Role");
const Compagny = use("App/Models/MainEntreprise");
const Agence = use("App/Models/Agence");
const { validateAll } = use("Validator");
const Database = use("Database");
const Helpers = use("Helpers");

class UserController {
    async index({ view, auth }) {
        const user = await auth.getUser();
        var today = new Date().getDate();
        console.log(today);
        const users = await Database.table("users").where({
            is_deleted: 0,
            compagny_id: user.compagny_id,
        });

        const compagny = await Compagny.find(user.compagny_id);
        const agence = await Database.table("agences").where(
            "compagny_id",
            user.compagny_id
        );
        console.log(agence);
        const log = await Database.table("onlines").where("status", 1);
        const role = await Database.table("roles").where(
            "compagny_id",
            user.compagny_id
        );
        return view.render("users.index", {
            user: user.toJSON(),
            users: users,
            compagny: compagny,
            agence: agence,
            role: role,
            log: log,
        });
    }
    create({ view }) {
        return view.render("user.create");
    }

    async signup({ session, request, response, auth }) {
        const data = request.only([
            "name",
            "email",
            "phone",
            "role_id",
            "agence_id",
            "cni",
        ]);
        const me = await auth.getUser();

        const validation = await validateAll(data, {
            email: "required|email|unique:users",
            phone: "required|unique:users",
        });
        const role = await Role.find(data.role_id);
        const agence = await Agence.find(data.agence_id);
        if (validation.fails()) {
            session.withErrors(validation.messages()).flashExcept(["cni"]);

            return response.redirect("back");
        }
        data.username = data.phone;
        data.password = data.phone;
        data.role_name = role.name;
        data.compagny_id = me.compagny_id;
        data.compagny = me.compagny;
        data.agence_name = agence.name;
        const save = await User.create(data);
        if (save) {
            session.flash({ notification: "Le compte a été créé avec succès!" });
        }
        return response.redirect("/users");
    }

    async mainLogo({ response, request, params }) {
        const compagny = await Compagny.find(params.id);

        const data = request.file("logo", {
            size: "2mb",
        });
        const log_name = new Date().getTime() + "." + data.subtype;

        compagny.logo = "assets/images/logo/" + log_name;

        await data.move(Helpers.publicPath("assets/images/logo"), {
            name: log_name,
            overwrite: true,
        });
        if (!data.moved()) {
            return data.error();
        }
        await compagny.save();

        return response.redirect("back");
    }
    async avatar({ response, request, params }) {
        const agent = await User.find(params.id);

        const data = request.file("avatar", {
            size: "2mb",
        });
        const log_name = new Date().getTime() + "." + data.subtype;

        agent.avatar = "assets/images/users/" + log_name;

        await data.move(Helpers.publicPath("assets/images/users"), {
            name: log_name,
            overwrite: true,
        });
        if (!data.moved()) {
            return data.error();
        }
        await agent.save();

        return response.redirect("back");
    }
    async view({ params, view, auth }) {
        const agent = await User.find(params.id);
        const me = await auth.getUser();
        return view.render("users.view", {
            agent: agent.toJSON(),
            me: me.toJSON(),
        });
    }
    async blocked({ response, params, session, auth }) {
        const user = await User.find(params.id);
        const del = await Database.table("users")
            .where("id", params.id)
            .update("is_activated", 0);

        if (del) {
            session.flash({
                notification: "L'utilisateur" + user.name + " a été bloqué avec succès!",
            });
        }
        return response.redirect("back");
    }
    async activated({ response, params, session, auth }) {
        const user = await User.find(params.id);

        const del = await Database.table("users")
            .where("id", params.id)
            .update("is_activated", 1);

        if (del) {
            session.flash({
                notification: "L'utilisateur" + user.name + " a été ré-activé avec succès!",
            });
        }
        return response.redirect("back");
    }
    async delete({ response, params, session, auth }) {
        const user = await User.find(params.id);

        const me = await auth.getUser();
        await Database.table("users")
            .where("id", params.id)
            .update("is_deleted", 1);
        const del = await Database.table("corbeilles").insert({
            deleted_id: params.id,
            name: user.name,
            table: "users",
            description: "Suppression du compte utilisateur de  " + user.name,
            auteur_id: me.id,
            auteur_name: me.username,
        });

        if (del) {
            session.flash({
                notification: "L'enregistrement a été déplacé dans la corbeille avec succès!",
            });
        }
        return response.redirect("back");
    }
}

module.exports = UserController;