"use strict";
const Article = use("App/Models/Article");
const Categorie = use("App/Models/Categorie");
const { validate } = use("Validator");
const Database = use("Database");
const Helpers = use("Helpers");
class ArticleController {
    async index({ auth, view }) {
        const user = await auth.getUser();
        //const agence = await User.find(user.agence_id);

        const article = await Database.table("articles")
            .where({
                compagny_id: user.compagny_id,
                is_deleted: 0,
            })
            .orderBy("id", "desc");
        const cat = await Database.table("categories").where({
            compagny_id: user.compagny_id,
            is_deleted: 0,
        });
        const entrepot = await Database.table("entrepots").where({
            compagny_id: user.compagny_id,
            is_deleted: 0,
        });
        return view.render("article.index", {
            entrepot: entrepot,
            cat: cat,
            article: article,
            user: user.toJSON(),
        });
    }
    async rayon({ auth, view }) {
        const user = await auth.getUser();

        const rayon = await Database.table("categories").where({
            compagny_id: user.compagny_id,
            is_deleted: 0,
        });

        return view.render("article.rayon", {
            rayon: rayon,
            user: user.toJSON(),
        });
    }
    async create({ response, request, session, auth }) {
        const me = await auth.getUser();
        const rules = {
            name: "required",
        };
        const data = request.only([
            "name",
            "categorie_id",
            "en_achat",
            "en_vente",
            "qut_min",
            "qut_max",
            "unite_mesure",
        ]);
        const data2 = request.only([
            "entrepot_id",
            "prix_achat",
            "prix_vente",
            "taxe",
            "qut",
        ]);
        const validation = await validate(data, rules);

        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll();

            return response.redirect("back");
        }
        const cat = await Database.table("categories").where({
            id: data.categorie_id,
        });
        console.log(cat[0].name);
        const entrepot = await Database.table("entrepots").where({
            id: data2.entrepot_id,
        });
        console.log(entrepot[0].name);
        data.categorie_name = cat[0].name;
        data.agence_id = me.agence_id;
        data.qut = data2.qut;
        data.prix_vente = data2.prix_vente;
        data.compagny_id = me.compagny_id;
        console.log(data);
        const save = await Article.create(data);
        data.qrCode = "00" + save.id;

        await Database.table("articles")
            .where("id", save.id)
            .update({ qrCode: data.qrCode, img: data.img });
        if (save) {
            data2.art_id = save.id;
            data2.art_name = data.name;
            data2.marge = data2.prix_vente - data2.prix_achat;
            data2.art_unite = data.unite_mesure;
            data2.entrepot_name = entrepot[0].name;
            data2.agence_id = me.agence_id;
            data2.compagny_id = me.compagny_id;
            const d = new Date();
            const ye = new Intl.DateTimeFormat("fr", {
                year: "numeric",
            }).format(d);
            const mo = new Intl.DateTimeFormat("fr", {
                month: "numeric",
            }).format(d);
            const da = new Intl.DateTimeFormat("fr", { day: "2-digit" }).format(d);

            data2.created_at = `${da}-${mo}-${ye}`;
            const save2 = await Database.table("stocks").insert([{
                art_id: data2.art_id,
                art_name: data2.art_name,
                art_unite: data2.art_unite,
                entrepot_id: data2.entrepot_id,
                entrepot_name: data2.entrepot_name,
                prix_achat: data2.prix_achat,
                prix_vente: data2.prix_vente,
                taxe: data2.taxe,
                marge: data2.marge,
                qut: data2.qut,
                agence_id: data2.agence_id,
                created_at: data.created_at,
                compagny_id: data2.compagny_id,
            }, ]);
            session.flash({ notification: "Le produit a été créé avec succès!" });
        } else {
            session.flash({
                warning: "Une erreur c'est produit lors de la création de l'entrepôt!",
            });
        }
        return response.redirect("/stock/article");
    }

    async view({ auth, view, params }) {
        const user = await auth.getUser();
        const article = await Article.find(params.id);
        const stock = await Database.table("stocks")
            .where({
                art_id: article.id,
                is_deleted: 0,
            })
            .orderBy("id", "desc");
        return view.render("article.view", {
            stock: stock,
            article: article,
            user: user.toJSON(),
        });
    }
    async rayCre({ response, request, session, auth }) {
        const me = await auth.getUser();
        const rules = {
            name: "required",
        };
        const data = request.only(["name", "description"]);
        const validation = await validate(data, rules);

        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll();

            return response.redirect("back");
        }

        data.agence_id = me.agence_id;
        data.compagny_id = me.compagny_id;

        const save = await Categorie.create(data);

        if (save) {
            session.flash({ notification: "Le rayon a été créé avec succès!" });
        } else {
            session.flash({
                warning: "Une erreur c'est produit lors de la création du rayon!",
            });
        }
        return response.redirect("/stock/article/rayon");
    }
    async check({ request, session, response }) {
        const data = request.only(["name"]);
        const article = await Database.table("articles").where({
            name: data.name,
        });
        var code = "25631";
        if (article.length >= 1) {
            session.flash({
                notification: "Le produit existe déjà dans la base de données!",
            });
            return response.redirect("/stock/article/view/" + article.id);
        } else {
            console.log(code);
            return (
                '<input type="text" id="qrCode" class="form-control" value="' +
                code +
                '" name="qrCode">'
            );
        }
    }

    async delete({ response, params, session, auth }) {
        const article = await Article.find(params.id);

        const me = await auth.getUser();
        await Database.table("articles")
            .where("id", params.id)
            .update("is_deleted", 1);
        const del = await Database.table("corbeilles").insert({
            deleted_id: params.id,
            name: article.name,
            table: "articles",
            description: "Suppression du produit " + article.name,
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

    async rayDel({ response, params, session, auth }) {
        const article = await Categorie.find(params.id);

        const me = await auth.getUser();
        await Database.table("categories")
            .where("id", params.id)
            .update("is_deleted", 1);
        const del = await Database.table("corbeilles").insert({
            deleted_id: params.id,
            name: article.name,
            table: "categories",
            description: "Suppression du rayon " + article.name,
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

module.exports = ArticleController;