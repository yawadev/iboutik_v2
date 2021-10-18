"use strict";

const Route = use("Route");

// Those routes should be only accessible
// when you are not logged in
Route.group(() => {
    Route.get("/", "SessionController.create");
    Route.post("login", "SessionController.store");
    Route.get("offline", "SessionController.offline");
    Route.get("register", "UserController.create");
    Route.post("register", "UserController.store");
}).middleware(["guest"]);

// Those routes should be only accessible
// when you are logged in
Route.group(() => {
    Route.get("logout", "SessionController.delete");

    //Home page
    Route.get("/start", "PostController.index");

    //Gestion des clients
    Route.get("main-entreprise", "MainEntrepriseController.index");
    Route.post("main-entreprise/create", "MainEntrepriseController.create");
    Route.get("main-entreprise/view/:id", "MainEntrepriseController.view");
    Route.get("main-entreprise/delete/:id", "MainEntrepriseController.delete");
    Route.put("main-entreprise/update/:id", "MainEntrepriseController.update");

    //Gestion des utiliasteurs
    Route.get("users", "UserController.index");
    Route.post("users/create", "UserController.signup");
    Route.get("users/view/:id", "UserController.view");
    Route.get("users/delete/:id", "UserController.delete");
    Route.put("users/update/:id", "UserController.update");
    Route.get("users/blocked/:id", "UserController.blocked");
    Route.get("users/activated/:id", "UserController.activated");
    Route.put("users/avatar/:id", "UserController.avatar");

    //Gestion des Stock
    //#### Entrepot
    Route.get("stock/entrepots", "EntrepotController.index");
    Route.post("stock/entrepots/create", "EntrepotController.create");
    Route.get("stock/entrepots/view/:id", "EntrepotController.view");
    Route.get("stock/entrepots/delete/:id", "EntrepotController.delete");
    Route.put("stock/entrepots/update/:id", "EntrepotController.update");
    //#### Produits
    Route.get("stock/article", "ArticleController.index");
    Route.post("stock/article/create", "ArticleController.create");
    Route.get("stock/article/view/:id", "ArticleController.view");
    Route.get("stock/article/delete/:id", "ArticleController.delete");
    Route.put("stock/article/update/:id", "ArticleController.update");
    Route.post("stock/article/check", "ArticleController.check");
    //#### Produits / Rayons
    Route.get("stock/article/rayon", "ArticleController.rayon");
    Route.post("stock/article/rayon/create", "ArticleController.rayCre");
    Route.get("stock/article/rayDel/:id", "ArticleController.rayDel");
    Route.put("stock/article/rayon/update/:id", "ArticleController.update");
    //#### Produits / Inventaire
    Route.get("stock/inventaire", "InventaireController.index");
    Route.get("stock/fiche_stock", "InventaireController.fiche");
    Route.post("stock/inventaire/create", "InventaireController.create");
    Route.post("stock/inventaire/achat", "InventaireController.achat");
    Route.post("stock/inventaire/vente", "InventaireController.vente");

    //#### POS
    Route.get("pos", "PosController.index");
    Route.get("pos/session", "PosController.index");
    Route.post("pos/create", "PosController.create");
    Route.get("pos/session/commande/add/:id", "PosController.addCommande");
    Route.get("pos/session/commande/view/:id", "PosController.viewCommande");
    Route.get("pos/session/commande/pay/:id", "PosController.payCommande");
    Route.post("pos/session/commande/addItem/:id", "PosController.addItem");
    Route.post("pos/session/commande/upItem/:id", "PosController.upItem");
    Route.post("pos/session/commande/remise/:id", "PosController.remise");
    Route.post("pos/session/commande/ajaxItem", "PosController.ajaxItem");
    Route.get("pos/session/commande/delItem/:id", "PosController.delItem");
    Route.get("pos/session/commande/:id", "PosController.commande");
    Route.get("pos/session/delCommande/:id", "PosController.delCommande");
    Route.get("pos/article", "PosController.article");

    //Parametrage
    Route.put("compagny/logo/:id", "UserController.mainLogo");
    Route.put("compagny/update/:id", "MainEntrepriseController.edit");
    Route.post("users/agence/:id", "MainEntrepriseController.addAgence");

    //Gestion de la corbeille
    Route.get("corbeille", "CorbeilleController.index");
    Route.get("corbeille/restore/:id/:table", "CorbeilleController.restore");
    Route.get("corbeille/delete/:id/:table", "CorbeilleController.delete");
}).middleware(["auth"]);