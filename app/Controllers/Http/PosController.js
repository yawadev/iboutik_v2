"use strict";
const Database = use("Database");
const Service = use("App/Models/Service");
const Commande = use("App/Models/Commande");

class PosController {
    async index({ view, auth }) {
        const user = await auth.getUser();
        const service = await Database.table("services")
            .where({
                user_id: user.id,
                is_deleted: 0,
            })
            .orderBy("id", "desc");
        return view.render("pos.index", {
            service: service,
            user: user.toJSON(),
        });
    }

    async article({ view, auth }) {
        const user = await auth.getUser();
        const article = await Database.table("articles").where({
            compagny_id: user.compagny_id,
            is_deleted: 0,
        });
        return view.render("pos.article.index", {
            article: article,
            user: user.toJSON(),
        });
    }
    async create({ response, request, session, auth }) {
        const me = await auth.getUser();
        const data = request.only(["debut_service"]);
        const d = new Date();
        var options = {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        };
        var options2 = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };
        const now = new Intl.DateTimeFormat("fr", options).format(d);
        const today = new Intl.DateTimeFormat("fr", options2).format(d);

        data.user_id = me.id;
        data.user_name = me.name;
        data.debut_service = now;
        data.fin_service = now;
        data.date_service = today;
        data.agence_id = me.agence_id;
        data.compagny_id = me.compagny_id;
        const save = await Service.create(data);
        data.service_num = "POS-00" + save.id;

        await Database.table("services")
            .where("id", save.id)
            .update({ service_num: data.service_num });
        if (save) {
            session.flash({ notification: "La session a été créé avec succès!" });
        } else {
            session.flash({
                warning: "Une erreur c'est produit lors de la création de la session!",
            });
        }
        return response.redirect("/pos");
    }
    async commande({ params, view, auth }) {
        const user = await auth.getUser();
        const service = await Service.find(params.id);
        const commande = await Database.table("commandes").where({
            session_id: params.id,
            is_deleted: 0,
        });
        const count = await Database.table("commandes")
            .where({
                session_id: params.id,
                is_deleted: 0,
            })
            .getCount();
        const com = await Database.table("commandes").where({
            session_id: params.id,
        });
        var arts = 0;
        if (com.length >= 1) {
            arts = await Database.table("invoice_items")
                .where({
                    fac_id: com[0].id,
                })
                .getSum("art_qut");
        }
        const sum = await Database.table("commandes")
            .where({
                session_id: params.id,
                is_deleted: 0,
            })
            .getSum("montant");
        const remise = await Database.table("commandes")
            .where({
                session_id: params.id,
                is_deleted: 0,
            })
            .getSum("remise");
        console.log(remise);
        return view.render("pos.commande.index", {
            service: service.toJSON(),
            commande: commande,
            count: count,
            sum: sum,
            arts: arts,
            remise: remise,
            user: user.toJSON(),
        });
    }
    async addCommande({ response, params, view, auth }) {
        const user = await auth.getUser();
        const service = await Service.find(params.id);
        const d = new Date();
        var options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        };
        const now = new Intl.DateTimeFormat("fr", options).format(d);
        const commande = await Database.table("commandes").insert([{
            session_id: service.id,
            session_num: service.service_num,
            client_name: "Anonyme",
            vendeur_id: user.id,
            vendeur: user.name,
            date_commande: now,
            agence_id: user.agence_id,
            compagny_id: user.compagny_id,
        }, ]);
        const recu_num = "COM-00" + commande[0];
        console.log(commande[0]);
        await Database.table("commandes")
            .where("id", commande[0])
            .update({ recu_num: recu_num });

        return response.redirect("/pos/session/commande/view/" + commande[0]);
    }
    async viewCommande({ params, view, auth }) {
        const user = await auth.getUser();
        const commande = await Commande.find(params.id);
        const service = await Service.find(commande.session_id);
        const article = await Database.table("articles").where({
            compagny_id: user.compagny_id,
            is_deleted: 0,
        });
        const items = await Database.table("invoice_items").where({
            fac_id: params.id,
            is_deleted: 0,
        });
        const totCom = await Database.table("invoice_items")
            .where({
                fac_id: params.id,
                is_deleted: 0,
            })
            .getSum("art_montant");
        return view.render("pos.view", {
            article: article,
            commande: commande,
            service: service,
            items: items,
            totCom: totCom,
            user: user.toJSON(),
        });
    }
    async addItem({ request, session, response }) {
        const data = request.only([
            "idCom",
            "unite_mesure",
            "art_id",
            "art_name",
            "art_prix",
            "art_qut",
        ]);
        var tot = Number(data.art_prix) * Number(data.art_qut);
        const itemExist = await Database.table("invoice_items").where({
            fac_id: data.idCom,
            art_id: data.art_id,
        });

        if (itemExist.length >= 1) {
            var art_qut = Number(itemExist[0].art_qut) + Number(data.art_qut);
            var art_montant = Number(itemExist[0].art_montant) + Number(tot);
            console.log("Quantité= " + art_qut + " - Prix= " + art_montant);
            var add = await Database.table("invoice_items")
                .where({
                    fac_id: data.idCom,
                    art_id: data.art_id,
                })
                .update({
                    art_qut: art_qut,
                    art_montant: art_montant,
                });
        } else {
            var add = await Database.table("invoice_items").insert([{
                type: "Vente",
                fac_id: data.idCom,
                art_id: data.art_id,
                art_name: data.art_name,
                art_unite: data.unite_mesure,
                art_qut: data.art_qut,
                art_prix: data.art_prix,
                art_montant: tot,
            }, ]);
        }
        const to = await Database.table("invoice_items")
            .where({
                fac_id: data.idCom,
            })
            .getSum("art_montant");
        await Database.table("commandes")
            .where({
                id: data.idCom,
            })
            .update({
                montant: to,
            });
        if (add) {
            session.flash({ notification: "La produit ajouté avec avec succès!" });
        } else {
            session.flash({
                warning: "Une erreur c'est produit lors de la création de la session!",
            });
        }
        return response.redirect("/pos/session/commande/view/" + data.idCom);
    }
    async ajaxItem({ request, response }) {
        const data = request.only([
            "idCom",
            "unite_mesure",
            "art_id",
            "art_name",
            "art_prix",
            "art_qut",
        ]);
        console.log(data);
        var tot = Number(data.art_prix) * Number(data.art_qut);
        const itemExist = await Database.table("invoice_items").where({
            fac_id: data.idCom,
            art_id: data.art_id,
        });

        if (itemExist.length >= 1) {
            var art_qut = Number(itemExist[0].art_qut) + Number(data.art_qut);
            var art_montant = Number(itemExist[0].art_montant) + Number(tot);
            console.log("Quantité= " + art_qut + " - Prix= " + art_montant);
            var add = await Database.table("invoice_items")
                .where({
                    fac_id: data.idCom,
                    art_id: data.art_id,
                })
                .update({
                    art_qut: art_qut,
                    art_montant: art_montant,
                });
        } else {
            var add = await Database.table("invoice_items").insert([{
                type: "Vente",
                fac_id: data.idCom,
                art_id: data.art_id,
                art_name: data.art_name,
                art_unite: data.unite_mesure,
                art_qut: data.art_qut,
                art_prix: data.art_prix,
                art_montant: tot,
            }, ]);
        }
        const to = await Database.table("invoice_items")
            .where({
                fac_id: data.idCom,
            })
            .getSum("art_montant");
        await Database.table("commandes")
            .where({
                id: data.idCom,
            })
            .update({
                montant: to,
            });
        if (add) {
            session.flash({
                notification: "La produit ajouté avec avec succès!",
            });
        } else {
            session.flash({
                warning: "Une erreur c'est produit lors de la création de la session!",
            });
        }
        // var item =
        //     '<td><p class="mb-0 d-flex justify-content-between"><span>' +
        //     items.art_name +
        //     "|</span><strong>" +
        //     items.art_qut +
        //     "</strong>|<strong>" +
        //     items.art_prix +
        //     " XOF</strong></p></td>";
        return response.status(200).send("cool");
    }
    async upItem({ request, response }) {
        const data = request.only([
            "id",
            "idCom",
            "art_name",
            "art_prix",
            "art_qut",
        ]);
        var tot = Number(data.art_prix) * Number(data.art_qut);
        await Database.table("invoice_items")
            .where({
                id: data.id,
            })
            .update({
                art_qut: data.art_qut,
                art_montant: tot,
            });
        const itTo = await Database.table("invoice_items")
            .where({
                fac_id: data.idCom,
            })
            .getSum("art_montant");
        const com = await Database.table("commandes").where({
            id: data.idCom,
        });
        var to = Number(itTo) - Number(com[0].remise);
        await Database.table("commandes")
            .where({
                id: data.idCom,
            })
            .update({
                montant: itTo,
                total: to,
            });
        return response.redirect("/pos/session/commande/view/" + data.idCom);
    }
    async remise({ request, response }) {
        const data = request.only(["id", "remise"]);
        const com = await Database.table("commandes").where({
            id: data.id,
        });
        var to = Number(com[0].montant) - Number(data.remise);
        await Database.table("commandes")
            .where({
                id: data.id,
            })
            .update({
                remise: data.remise,
                total: to,
            });

        return response.redirect("/pos/session/commande/view/" + data.id);
    }
    async delItem({ response, params }) {
        const item = await Database.table("invoice_items").where("id", params.id);
        const com = await Database.table("commandes").where({
            id: item[0].fac_id,
        });
        var to = Number(com[0].montant) - Number(item[0].art_montant);
        var rem = Number(to) - Number(com[0].remise);
        await Database.table("commandes")
            .where({
                id: item[0].fac_id,
            })
            .update({
                montant: to,
                total: rem,
            });
        await Database.table("invoice_items").where("id", params.id).delete();
        return response.redirect("back");
    }

    async payCommande(params, view, auth) {
        const commande = await Commande.find(params.id);
        return view.render("pos.commande.pay", {
            commande: commande,
        });
    }
    async delCommande({ response, params, session, auth }) {
        const commande = await Commande.find(params.id);

        const me = await auth.getUser();
        await Database.table("commandes")
            .where("id", params.id)
            .update("is_deleted", 1);
        const del = await Database.table("corbeilles").insert({
            deleted_id: params.id,
            name: commande.recu_num,
            table: "commandes",
            description: "Suppression de la commande " + commande.recu_num,
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
    async delete({ response, params, session, auth }) {
        const service = await Service.find(params.id);

        const me = await auth.getUser();
        await Database.table("services")
            .where("id", params.id)
            .update("is_deleted", 1);
        const del = await Database.table("corbeilles").insert({
            deleted_id: params.id,
            name: service.service_num,
            table: "services",
            description: "Suppression de la services " + service.service_num,
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

module.exports = PosController;