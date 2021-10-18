"use strict";
const Database = use("Database");
const Article = use("App/Models/Article");

class InventaireController {
    async index({ auth, view }) {
        const user = await auth.getUser();
        const stock = await Database.table("stocks")
            .where({
                compagny_id: user.compagny_id,
                is_deleted: 0,
            })
            .orderBy("id", "desc");
        const article = await Database.table("articles")
            .where({
                compagny_id: user.compagny_id,
                is_deleted: 0,
            })
            .orderBy("id", "desc");
        const entrepot = await Database.table("entrepots").where({
            compagny_id: user.compagny_id,
            is_deleted: 0,
        });

        const d = new Date();
        const ye = new Intl.DateTimeFormat("fr", { year: "numeric" }).format(d);
        const mo = new Intl.DateTimeFormat("fr", { month: "numeric" }).format(d);
        const da = new Intl.DateTimeFormat("fr", { day: "2-digit" }).format(d);

        const today = `${da}-${mo}-${ye}`;
        return view.render("inventaire.index", {
            stock: stock,
            article: article,
            today: today,
            entrepot: entrepot,
            user: user.toJSON(),
        });
    }
    async fiche({ auth, view }) {
        const user = await auth.getUser();
        const stock = await Database.table("stocks")
            .where({
                compagny_id: user.compagny_id,
                is_deleted: 0,
            })
            .groupBy("id")
            .orderBy("id", "desc");
        const article = await Database.table("articles")
            .where({
                compagny_id: user.compagny_id,
                is_deleted: 0,
            })
            .orderBy("id", "desc");
        const entrepot = await Database.table("entrepots").where({
            compagny_id: user.compagny_id,
            is_deleted: 0,
        });

        const d = new Date();
        const ye = new Intl.DateTimeFormat("fr", { year: "numeric" }).format(d);
        const mo = new Intl.DateTimeFormat("fr", { month: "numeric" }).format(d);
        const da = new Intl.DateTimeFormat("fr", { day: "2-digit" }).format(d);

        const today = `${da}-${mo}-${ye}`;
        return view.render("inventaire.fiche_stock", {
            stock: stock,
            article: article,
            today: today,
            entrepot: entrepot,
            user: user.toJSON(),
        });
    }
    async create({ response, request, session, auth }) {
        const me = await auth.getUser();

        const data = request.only([
            "art_id",
            "entrepot_id",
            "prix_achat",
            "prix_vente",
            "taxe",
            "qut",
        ]);

        const article = await Database.table("articles").where({
            id: data.art_id,
        });
        const entrepot = await Database.table("entrepots").where({
            id: data.entrepot_id,
        });
        data.art_name = article[0].name;
        data.marge = Number(data.prix_vente) - Number(data.prix_achat);
        var qut = Number(data.qut) + Number(article[0].qut);
        data.art_unite = article[0].unite_mesure;
        data.entrepot_name = entrepot[0].name;
        data.agence_id = me.agence_id;
        data.compagny_id = me.compagny_id;
        const d = new Date();
        const ye = new Intl.DateTimeFormat("fr", { year: "numeric" }).format(d);
        const mo = new Intl.DateTimeFormat("fr", { month: "numeric" }).format(d);
        const da = new Intl.DateTimeFormat("fr", { day: "2-digit" }).format(d);

        data.created_at = `${da}-${mo}-${ye}`;
        const save2 = await Database.table("stocks").insert([{
            art_id: data.art_id,
            art_name: data.art_name,
            art_unite: data.art_unite,
            entrepot_id: data.entrepot_id,
            entrepot_name: data.entrepot_name,
            prix_achat: data.prix_achat,
            prix_vente: data.prix_vente,
            taxe: data.taxe,
            marge: data.marge,
            qut: data.qut,
            agence_id: data.agence_id,
            created_at: data.created_at,
            compagny_id: data.compagny_id,
        }, ]);
        if (save2) {
            await Database.table("articles").where("id", data.art_id).update({
                prix_vente: data.prix_vente,
                prix_achat: data.prix_achat,
                qut: qut,
            });
            session.flash({ notification: "Le produit a été créé avec succès!" });
        } else {
            session.flash({
                warning: "Une erreur c'est produit lors de la création de l'entrepôt!",
            });
        }
        return response.redirect("/stock/inventaire");
    }
    async pdf() {
        const doc = new jsPDF();
        doc.text("Hello world!", 10, 10);
        doc.save("a4.pdf");
    }

    async vente({ request }) {
        const data = request.only(["id"]);
        const cat = await Database.table("articles").where({
            id: data.id,
        });
        console.log(cat[0].prix_vente);
        var vente =
            '<input type="number" name="prix_vente" value="' +
            cat[0].prix_vente +
            '"class="form-control" required>';
        var achat =
            '<input type="number" name="prix_achat" value="' +
            cat[0].prix_achat +
            '"class="form-control" required>';
        return {
            vente,
            achat,
        };
    }
}

module.exports = InventaireController;