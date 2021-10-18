"use strict";
const Entrepot = use("App/Models/Entrepot");
const { validate } = use("Validator");
const Database = use("Database");

class EntrepotController {
    async index({ auth, view }) {
        const user = await auth.getUser();

        const entrepot = await Database.table("entrepots").where({
            compagny_id: user.compagny_id,
            is_deleted: 0,
        });

        return view.render("entrepot.index", {
            entrepot: entrepot,
            user: user.toJSON(),
        });
    }
    async create({ response, request, session, auth }) {
        const me = await auth.getUser();
        const rules = {
            name: "required",
            adresse: "required",
        };
        const data = request.only(["name", "adresse"]);

        const validation = await validate(data, rules);

        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll();

            return response.redirect("back");
        }
        data.agence_id = me.agence_id;
        data.compagny_id = me.compagny_id;
        console.log(data);
        const save = await Entrepot.create(data);
        if (save) {
            session.flash({ notification: "L'entrepôt a été créé avec succès!" });
        } else {
            session.flash({
                warning: "Une erreur c'est produit lors de la création de l'entrepôt!",
            });
        }
        return response.redirect("/stock/entrepots");
    }

    async update({ response, request, params }) {
        const entrepot = await Entrepot.find(params.id);

        entrepot.merge(request.only(["name", "adresse"]));

        await entrepot.save();

        return response.redirect("back");
    }

    async view({ params, view, auth }) {
        const entrepot = await Entrepot.find(params.id);

        const user = await auth.getUser();
        return view.render("entrepot.view", {
            entr: entrepot.toJSON(),
            user: user.toJSON(),
        });
    }

    async delete({ response, params, session, auth }) {
        const entrepot = await Entrepot.find(params.id);

        const me = await auth.getUser();
        await Database.table("entrepots")
            .where("id", params.id)
            .update("is_deleted", 1);
        const del = await Database.table("corbeilles").insert({
            deleted_id: params.id,
            name: entrepot.name,
            table: "entrepots",
            description: "Suppression de l'entrepôt " + entrepot.name,
            auteur_id: me.id,
            auteur_name: me.name,
        });

        if (del) {
            session.flash({
                notification: "L'enregistrement a été déplacé dans la corbeille avec succès!",
            });
        }
        return response.redirect("back");
    }
}

module.exports = EntrepotController;