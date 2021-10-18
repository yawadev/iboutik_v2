"use strict";
const { validate } = use("Validator");
const Database = use("Database");

class PostController {
    async index({ view, auth }) {
        const user = await auth.getUser();
        const article = await Database.table("articles").where({
            compagny_id: user.compagny_id,
            is_deleted: 0,
        });
        return view.render("posts.index", {
            article: article,
            user: user.toJSON(),
        });
    }
}

module.exports = PostController;