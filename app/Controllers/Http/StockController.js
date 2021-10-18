"use strict";
const Article = use("App/Models/Article");
const Stock = use("App/Models/Stock");
const Categorie = use("App/Models/Categorie");
const { validate } = use("Validator");
const Database = use("Database");
const Helpers = use("Helpers");

class StockController {
    async index({ auth, view }) {
        const user = await auth.getUser();
        const article = await Database.table("articles")
            .join("stocks", "articles.id", "=", "stocks.art_id")
            .select("articles.*")
            .select("stocks.*");

        return view.render("inventaire.index", {
            article: article,
            user: user.toJSON(),
        });
    }
}

module.exports = StockController;