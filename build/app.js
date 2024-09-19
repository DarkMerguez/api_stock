"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Models :
const { ProductCategory } = require("./database");
const { EnterpriseCategory } = require("./database");
const { Product } = require("./database");
const { Carac } = require("./database");
const { Image } = require("./database");
const { User } = require("./database");
const { Cart } = require("./database");
const { Role } = require("./database");
const { CaracProduct } = require("./database");
const { ProductImage } = require("./database");
const { ProductCart } = require("./database");
const { Bill } = require("./database");
const { BillProduct } = require("./database");
const { Enterprise } = require("./database");
const { Order } = require("./database");
const { OrderProduct } = require("./database");
const sequelize = require("./database");
const { Op } = require("sequelize");
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(fileUpload());
// ROUTES DE PRODUIT :
app.get("/products", async (req, res) => {
    try {
        const products = await Product.findAll();
        products.length > 0 ? res.status(200).json(products) : res.status(404).json({ message: "Aucun produit" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
    }
});
app.get("/product/:id", async (req, res) => {
    const product = await Product.findByPk(req.params.id)
        .catch((error) => res.status(500).json("Erreur 500"));
    if (product) {
        res.status(200).json(product);
    }
    else {
        res.status(404).json({ message: "Aucun Produit trouvé avec cet id." });
    }
});
app.get("/products/search/:text", async (req, res) => {
    const text = req.params.text.toLowerCase();
    try {
        // doc sequelize : op like
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${text}%`
                        }
                    },
                    {
                        description: {
                            [Op.like]: `%${text}%`
                        }
                    }
                ]
            }
        });
        products.length > 0 ? res.status(200).json(products) : res.status(404).json({ message: "Aucun Produit trouvé avec cette entrée." });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
    }
});
app.post("/product", async (req, res) => {
    const newProduct = req.body;
    const product = {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        isFavorite: newProduct.isFavorite,
        stock: newProduct.stock,
        EnterpriseId: newProduct.EnterpriseId,
        ProductCategoryId: newProduct.ProductCategoryId
    };
    const productCategory = await ProductCategory.findByPk(newProduct.ProductCategoryId);
    if (productCategory) {
        const createdProduct = await Product.create(product);
        res.status(200).json(createdProduct); // Retourne l'objet complet
    }
    else {
        res.status(400).json("catégorie inexistante");
    }
});
app.delete("/product/:id", async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        const productDestroyed = product.dataValues;
        await product.destroy({
            where: {
                id: req.params.id
            }
        });
        product ? res.status(200).json({ message: "Produit supprimé : ", data: productDestroyed }) : res.status(400).json({ message: "Erreur lors de la suppression" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur 500" });
    }
});
app.put("/product/:id", async (req, res) => {
    try {
        const modifiedProduct = req.body;
        await Product.update(modifiedProduct, {
            where: {
                id: req.params.id
            }
        });
        // Recharger les données du Produit mis à jour depuis la base de données
        const updatedProduct = await Product.findByPk(req.params.id);
        console.log(updatedProduct);
        modifiedProduct ? res.status(200).json(updatedProduct) : res.status(400).json({ message: "Erreur lors de la modification" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification du Produit." });
    }
});
// ROUTES POUR LES ENTREPRISES :
app.get("/enterprises", async (req, res) => {
    try {
        const enterprises = await Enterprise.findAll();
        enterprises.length > 0 ? res.status(200).json(enterprises) : res.status(404).json({ message: "Aucune entreprise" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des entreprises." });
    }
});
app.get("/enterprise/:id", async (req, res) => {
    const enterprise = await Enterprise.findByPk(req.params.id)
        .catch((error) => res.status(500).json("Erreur 500"));
    if (enterprise) {
        res.status(200).json(enterprise);
    }
    else {
        res.status(404).json({ message: "Aucune entreprise trouvé avec cet id." });
    }
});
app.get("/enterprises/search/:text", async (req, res) => {
    const text = req.params.text.toLowerCase();
    try {
        // doc sequelize : op like
        const enterprises = await Enterprise.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${text}%`
                        }
                    },
                    {
                        siret: text
                    }
                ]
            }
        });
        enterprises.length > 0 ? res.status(200).json(enterprises) : res.status(404).json({ message: "Aucune entreprise trouvé avec cette entrée." });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des entreprises." });
    }
});
app.post("/enterprise", async (req, res) => {
    const newEnterprise = req.body;
    const enterprise = {
        name: newEnterprise.name,
        address: newEnterprise.address,
        siret: newEnterprise.siret,
        EnterpriseCategoryId: newEnterprise.EnterpriseCategoryId,
        ImageId: newEnterprise.ImageId
    };
    const enterpriseCategory = await EnterpriseCategory.findByPk(newEnterprise.EnterpriseCategoryId);
    if (enterpriseCategory) {
        await Enterprise.create(enterprise);
        res.status(200).json(enterprise.name + " a été ajoutée à la liste des entreprises");
    }
    else {
        res.status(400).json("catégorie d'entreprise inexistante");
    }
});
app.delete("/enterprise/:id", async (req, res) => {
    try {
        const enterprise = await Enterprise.findByPk(req.params.id);
        const enterpriseDestroyed = enterprise.dataValues;
        await enterprise.destroy({
            where: {
                id: req.params.id
            }
        });
        enterprise ? res.status(200).json({ message: "Entreprise supprimée : ", data: enterpriseDestroyed }) : res.status(400).json({ message: "Erreur lors de la suppression" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur 500" });
    }
});
app.put("/enterprise/:id", async (req, res) => {
    try {
        const modifiedEnterprise = req.body;
        await Enterprise.update(modifiedEnterprise, {
            where: {
                id: req.params.id
            }
        });
        // Recharger les données de l'entreprise mise à jour depuis la base de données
        const updatedEnterprise = await Enterprise.findByPk(req.params.id);
        console.log(updatedEnterprise);
        modifiedEnterprise ? res.status(200).json(updatedEnterprise) : res.status(400).json({ message: "Erreur lors de la modification" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de l'entreprise." });
    }
});
// ROUTES POUR LES USERS :
app.get("/users", async (req, res) => {
    try {
        const users = await User.findAll();
        users.length > 0 ? res.status(200).json(users) : res.status(404).json({ message: "Aucun User" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des users." });
    }
});
app.get("/user/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id)
        .catch((error) => res.status(500).json("Erreur 500"));
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ message: "Aucun user trouvé avec cet id." });
    }
});
app.post("/user/signup", async (req, res) => {
    try {
        const newUser = req.body;
        const user = await User.create({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            password: newUser.password,
            email: newUser.email,
            EnterpriseId: newUser.EnterpriseId,
            RoleId: newUser.RoleId
        });
        user ? res.status(200).json("L'utilisateur " + newUser.firstName + " " + newUser.lastName + " a été ajouté(e) avec succès") : res.status(400).json("erreur saisie");
    }
    catch (error) {
        console.log(error);
        res.status(500).json("erreur 500");
    }
});
app.delete("/user/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        const userDestroyed = user.dataValues;
        await user.destroy();
        user != undefined ? res.status(200).json({ message: "utilisateur supprimé", data: userDestroyed }) : res.status(400).json({ message: "Erreur 400" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("erreur 500");
    }
});
app.put("/user/:id", async (req, res) => {
    try {
        const modifiedUser = req.body;
        await User.update(modifiedUser, {
            where: {
                id: req.params.id
            }
        });
        // Recharger les données de l'utilisateur mis à jour depuis la base de données
        const updatedUser = await User.findByPk(req.params.id);
        modifiedUser ? res.status(200).json(updatedUser) : res.status(400).json({ message: "Erreur lors de la modification" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur." });
    }
});
// ROUTES PRODUCTCATEGORIES :
app.get("/productcategories", async (req, res) => {
    try {
        const categories = await ProductCategory.findAll();
        categories != undefined ? res.status(200).json(categories) : res.status(400).json({ message: "Erreur 400" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("erreur 500");
    }
});
app.get("/productcategory/:id", async (req, res) => {
    try {
        const category = await ProductCategory.findByPk(req.params.id);
        category != undefined ? res.status(200).json(category) : res.status(400).json({ message: "Erreur 400" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Erreur 500");
    }
});
app.post("/productcategory", async (req, res) => {
    const newCategory = req.body;
    const category = await ProductCategory.create({
        title: newCategory.title
    });
    res.status(200).json(category.title + " a été ajouté à la liste des catégories de produits");
});
app.delete("/productcategory/:id", async (req, res) => {
    try {
        const category = await ProductCategory.findByPk(req.params.id);
        const categoryDestroyed = category.dataValues;
        await category.destroy();
        category != undefined ? res.status(200).json({ message: "catégorie de produit supprimée", data: categoryDestroyed }) : res.status(400).json({ message: "Erreur 400" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("erreur 500");
    }
});
app.put("/productcategory/:id", async (req, res) => {
    try {
        const modifiedCategory = req.body;
        await ProductCategory.update(modifiedCategory, {
            where: {
                id: req.params.id
            }
        });
        // Recharger les données de la Category mise à jour depuis la base de données
        const updatedCategory = await ProductCategory.findByPk(req.params.id);
        modifiedCategory ? res.status(200).json(updatedCategory) : res.status(400).json({ message: "Erreur lors de la modification" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de la catégorie." });
    }
});
// ROUTES ENTERPRISECATEGORIES :
app.get("/enterprisecategories", async (req, res) => {
    try {
        const categories = await EnterpriseCategory.findAll();
        categories != undefined ? res.status(200).json(categories) : res.status(400).json({ message: "Erreur 400" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("erreur 500");
    }
});
app.get("/enterprisecategory/:id", async (req, res) => {
    try {
        const category = await EnterpriseCategory.findByPk(req.params.id);
        category != undefined ? res.status(200).json(category) : res.status(400).json({ message: "Erreur 400" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Erreur 500");
    }
});
app.post("/enterprisecategory", async (req, res) => {
    const newCategory = req.body;
    const category = await EnterpriseCategory.create({
        title: newCategory.title
    });
    res.status(200).json(category.title + " a été ajouté à la liste des catégories d'entreprises'");
});
app.delete("/enterprisecategory/:id", async (req, res) => {
    try {
        const category = await EnterpriseCategory.findByPk(req.params.id);
        const categoryDestroyed = category.dataValues;
        await category.destroy();
        category != undefined ? res.status(200).json({ message: "catégorie d'entreprise supprimée", data: categoryDestroyed }) : res.status(400).json({ message: "Erreur 400" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("erreur 500");
    }
});
app.put("/enterprisecategory/:id", async (req, res) => {
    try {
        const modifiedCategory = req.body;
        await EnterpriseCategory.update(modifiedCategory, {
            where: {
                id: req.params.id
            }
        });
        // Recharger les données de la Category mise à jour depuis la base de données
        const updatedCategory = await EnterpriseCategory.findByPk(req.params.id);
        modifiedCategory ? res.status(200).json(updatedCategory) : res.status(400).json({ message: "Erreur lors de la modification" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de la catégorie." });
    }
});
// ROUTES IMAGES :
//Gérer l'upload de fichiers :
app.post("/upload", async (req, res) => {
    try {
        // Vérifier si un fichier a été envoyé
        if (!req.files || !req.files.image) {
            return res.status(400).json({ msg: "No image sent by the client" });
        }
        const image = req.files.image;
        const allowedExtensions = /jpg|jpeg|png|gif/;
        // Vérifier si le fichier est bien une image (par extension)
        const extensionFile = path.extname(image.name).toLowerCase();
        if (!allowedExtensions.test(extensionFile)) {
            return res.status(400).json({ msg: "Invalid image format. Only JPG, PNG, and GIF are allowed." });
        }
        // Former un nom unique pour le fichier
        const fileName = path.basename(image.name, extensionFile);
        const completeFileName = `${fileName}_${Date.now()}${extensionFile}`;
        // Uploader le fichier dans le dossier /public
        const uploadPath = path.join(__dirname, 'public', completeFileName);
        image.mv(uploadPath, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "Error while uploading the file" });
            }
            // Sauvegarder l'URL de l'image dans la table Images
            const newImage = await Image.create({
                url: `http://localhost:8051/${completeFileName}`
            });
            // Si l'image est associée à un utilisateur ou à une entreprise, on peut l'associer ici.
            // Par exemple, pour un User (en supposant que req.body.userId soit fourni) :
            /*
            const userId = req.body.userId; // Id du User envoyé avec la requête
            if (userId) {
                const user = await User.findByPk(userId);
                if (user) {
                    await user.setImage(newImage); // Associer l'image à l'utilisateur
                }
            }
            */
            res.status(200).json({
                msg: 'Image uploaded and saved in database',
                imageId: newImage.id, // Ajoutez cette ligne pour renvoyer l'ID
                imageUrl: newImage.url
            });
        });
    }
    catch (error) {
        res.status(500).json({ msg: "An error occurred", error });
    }
});
app.post("/image", async (req, res) => {
    const image = req.body;
    try {
        await Image.create(image);
        res.status(200).json({ msg: "Image ajoutée avec succès" });
    }
    catch (error) {
        res.status(500).json({ msg: "Erreur lors de l'ajout d'image" });
    }
});
app.post("/productImages", async (req, res) => {
    const { ProductId, ImageId } = req.body;
    console.log("Received ProductId:", ProductId);
    console.log("Received ImageId:", ImageId);
    try {
        await ProductImage.create({ ProductId, ImageId });
        res.status(200).json({ msg: "Association produit-image réussie" });
    }
    catch (error) {
        res.status(500).json({ msg: "Erreur lors de l'association produit-image", error });
    }
});
app.listen(8051, () => {
    console.log("Youhouuuuu serveur lancé sur localhost:8051");
});
