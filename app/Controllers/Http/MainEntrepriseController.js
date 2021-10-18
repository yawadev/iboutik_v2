"use strict";
const Compagny = use("App/Models/MainEntreprise");
const Corbeille = use("App/Models/Corbeille");
const Role = use("App/Models/Role");
const Agence = use("App/Models/Agence");
const { validate } = use("Validator");
const Helpers = use("Helpers");
const Database = use("Database");
const Hash = use("Hash");
const User = use("App/Models/User");

class MainEntrepriseController {
    async index({ view, auth }) {
        const user = await auth.getUser();
        const compagny = await Database.table("main_entreprises").where(
            "is_deleted",
            0
        );
        const ville = await Database.table("ville").orderBy("id", "nom");
        const role = await Database.table("roles");

        return view.render("compagny.index", {
            role: role,
            ville: ville,
            compagny: compagny,
            user: user.toJSON(),
        });
    }
    async create({ response, request, session }) {
        const rules = {
            name: "required",
            type: "required",
            categorie: "required",
            contact_name: "required",
            contact_phone: "required",
            contact_email: "required",
            contact_post: "required",
        };
        const data = request.only([
            "name",
            "type",
            "categorie",
            "ninea",
            "email",
            "phone",
            "adress",
            "website",
            "ville",
            "contact_name",
            "contact_phone",
            "contact_post",
            "contact_email",
        ]);
        const validation = await validate(data, rules);

        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll();
            return response.redirect("back");
        }
        data.status = 1;

        const signup = request.only([
            "contact_name",
            "contact_phone",
            "contact_post",
            "contact_email",
        ]);
        const role = await Role.find(data.contact_post);
        data.contact_post = role.name;
        const save = await Compagny.create(data);

        if (save) {
            const name = signup.contact_name;
            const username = signup.contact_phone;
            const email = signup.contact_email;
            const password = await Hash.make(signup.contact_phone);
            const role_id = signup.contact_post;
            const role_name = role.name;
            const compagny = data.name;
            const agence_id = save.id;
            const phone = signup.contact_phone;
            const saveUser = await Database.table("users").insert([{
                name: name,
                username: username,
                email: email,
                password: password,
                role_id: role_id,
                role_name: role_name,
                compagny_id: saveUser.id,
                compagny: compagny,
                agence_id: agence_id,
                agence_name: compagny,
                phone: phone,
            }, ]);

            if (saveUser) {
                session.flash({ notification: "Le Client a été créé avec succès!" });
            } else {
                session.flash({
                    warning: "Une erreur c'est produit lors de la création du compte utilisateur!",
                });
            }
        }
        return response.redirect("/main-entreprise");
    }
    async addAgence({ response, request, session, params }) {
        const compagny = await Compagny.find(params.id);
        const data = request.only(["name", "type"]);

        data.compagny_id = compagny.id;
        const save = await Agence.create(data);
        if (save) {
            session.flash({
                notification: "L'agence a été créé avec succès!",
            });
        }
        return response.redirect("/users");
    }
    async edit({ response, request, params, session }) {
        const compagny = await Compagny.find(params.id);
        const data = request.only([
            "name",
            "ninea",
            "phone",
            "email",
            "adress",
            "ville",
            "website",
        ]);
        compagny.merge(data);
        const save = await compagny.save();
        if (save) {
            session.flash({
                notification: "Les infos de l'entreprise ont été modifié avec succès!",
            });
        }
        return response.redirect("back");
    }
    async delete({ response, params, session, auth }) {
        const compagny = await Compagny.find(params.id);

        const user = await auth.getUser();
        await Database.table("main_entreprises")
            .where("id", params.id)
            .update("is_deleted", 1);
        const del = await Database.table("corbeilles").insert({
            deleted_id: params.id,
            name: compagny.name,
            table: "main_entreprises",
            description: "Suppression du client " + compagny.name,
            auteur_id: user.id,
            auteur_name: user.name,
        });

        if (del) {
            session.flash({
                notification: "L'enregistrement a été déplacé dans la corbeille avec succès!",
            });
        }
        return response.redirect("back");
    }
}

module.exports = MainEntrepriseController;