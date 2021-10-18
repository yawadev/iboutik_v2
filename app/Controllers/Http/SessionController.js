"use strict";
const Database = use("Database");
const Online = use("App/Models/Online");

class SessionController {
    create({ view }) {
        return view.render("session.create");
    }

    offline({ view }) {
        return view.render("session.offline");
    }

    async store({ auth, request, response, session }) {
        const { username, password } = request.all();
        const checkMe = await Database.table("users").where({
            username: username,
            is_activated: 1,
        });
        console.log(checkMe.length);
        if (checkMe.length >= 1) {
            try {
                await auth.attempt(username, password);
            } catch (e) {
                session.flashExcept(["password"]);

                session.flash({
                    error: "Oups! Identifiants incorrects.",
                });

                return response.redirect("/");
            }
            const user = await auth.getUser();
            const ip = request.ip();
            await Database.table("onlines").insert({
                user_id: user.id,
                username: user.name,
                role: user.role,
                ip: ip,
                status: 1,
            });
            await Database.table("users").where("id", user.id).update("is_log", 1);
            if (user.role_id == "3") {
                return response.redirect("/pos");
            } else {
                return response.redirect("/start");
            }
        } else {
            session.flash({
                error: "Oups! Votre compte n'existe pas ou a été désactivé. Veillez contacter l'administrateur.",
            });

            return response.redirect("/");
        }
    }
    async delete({ auth, response }) {
        const user = await auth.getUser();
        await Database.table("onlines")
            .where("user_id", user.id)
            .update("status", 0);
        await Database.table("users").where("id", user.id).update("is_log", 1);
        await auth.logout();
        return response.redirect("/");
    }
}

module.exports = SessionController;