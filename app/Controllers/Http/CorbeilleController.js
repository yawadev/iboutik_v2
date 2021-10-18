"use strict";

const Corbeille = use("App/Models/Corbeille");
const Database = use("Database");

class CorbeilleController {
    async index({ view, auth }) {
        const corbeille = await Corbeille.all();
        const user = await auth.getUser();
        return view.render("corbeille.index", {
            corbeille: corbeille.toJSON(),
            user: user.toJSON(),
        });
    }
    async restore({ response, params, session }) {
        await Database.table(params.table)
            .where("id", params.id)
            .update("is_deleted", 0);
        const del = await Database.table("corbeilles")
            .where("deleted_id", params.id)
            .delete();

        if (del) {
            session.flash({
                notification: "L'enregistrement a été restauré avec succès!",
            });
        }
        return response.redirect("back");
    }

    async delete({ response, params, session }) {
        await Database.table(params.table).where("id", params.id).delete();
        const del = await Database.table("corbeilles")
            .where("deleted_id", params.id)
            .delete();

        if (del) {
            session.flash({
                notification: "L'enregistrement a été supprimé définitivement dans la base de données!",
            });
        }
        return response.redirect("back");
    }
}

module.exports = CorbeilleController;