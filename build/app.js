"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
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
const PDFDocument = require('pdfkit');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fileUpload = require("express-fileupload");
const path = require('path');
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(fileUpload());
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.JWT_SECRET;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.json());
// Middleware pour vérifier le JWT
const checkJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1]; // Extraire le token (sans le mot 'Bearer')
    jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
        if (err)
            return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded;
        next();
    });
};
// Route protégée par JWT
app.get('/protected', checkJwt, (req, res) => {
    res.json({ message: 'You are authorized', user: req.body.user });
});
// Route de login pour générer un token JWT
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Rechercher l'utilisateur par email
        const user = await User.findOne({ where: { email } });
        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        // Comparer le mot de passe fourni avec le hachage stocké
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Créer un payload JWT
        let payload = {
            email: user.email,
            role: user.role,
            id: user.id,
            ImageId: user.ImageId
        };
        // Ajouter l'EnterpriseId s'il existe
        if (user.EnterpriseId) {
            payload.EnterpriseId = user.EnterpriseId;
        }
        // Générer le token
        const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '1d' });
        res.json({ token });
    }
    catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Récupérer un utilisateur grâce au token :
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ msg: "No token provided" });
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ msg: "Invalid token" });
        req.user = user; // Ajouter l'utilisateur au requête pour l'utiliser plus tard
        next();
    });
};
exports.authenticateToken = authenticateToken;
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
    try {
        const product = await Product.findByPk(req.params.id)
            .catch((error) => res.status(500).json("Erreur 500"));
        if (product) {
            res.status(200).json(product);
        }
        else {
            res.status(404).json({ message: "Aucun Produit trouvé avec cet id." });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
    }
});
app.get("/products/category/:productCategoryId", async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                ProductCategoryId: req.params.productCategoryId
            }
        });
        if (products) {
            res.status(200).json(products);
        }
        else {
            res.status(404).json({ message: "Aucun Produit trouvé avec cette categoryId." });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
    }
});
app.get("/products/enterprise/:enterpriseId", async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                EnterpriseId: req.params.enterpriseId
            }
        });
        if (products) {
            res.status(200).json(products);
        }
        else {
            res.status(404).json({ message: "Aucun Produit trouvé avec cette entreprise." });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
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
app.post('/product', exports.authenticateToken, async (req, res) => {
    const userId = req.user.id; // Récupérer l'id de l'utilisateur depuis le token JWT
    const user = await User.findByPk(userId, { include: Enterprise });
    if (!user || !user.EnterpriseId) {
        return res.status(400).json({ message: 'L\'utilisateur n\'a pas d\'entreprise associée.' });
    }
    const { name, price, description, stock, isFavorite, ProductCategoryId } = req.body;
    try {
        const product = await Product.create({
            name,
            price,
            description,
            stock,
            isFavorite,
            ProductCategoryId,
            EnterpriseId: user.EnterpriseId // Associer directement l'EnterpriseId récupéré
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du produit.' });
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
        // Mettre à jour les informations du produit
        await Product.update(modifiedProduct, {
            where: { id: req.params.id }
        });
        // Gérer la suppression des images
        if (req.body.imagesToDelete) {
            const imagesToDelete = JSON.parse(req.body.imagesToDelete);
            for (const imageId of imagesToDelete) {
                await ProductImage.destroy({
                    where: {
                        ProductId: req.params.id,
                        ImageId: imageId
                    }
                });
            }
        }
        // Gérer l'ajout de nouvelles images
        if (req.files && req.files.images) {
            const images = req.files.images;
            for (const image of images) {
                // Définir le chemin où l'image doit être sauvegardée
                const uploadPath = path.join(__dirname, 'public', image.name);
                // Déplacer l'image vers le répertoire public
                await image.mv(uploadPath);
                // Créer une nouvelle entrée dans la table Images
                const newImage = await Image.create({
                    url: `http://localhost:8051/${image.name}`, // Assurez-vous que le chemin est correct ici
                    // Autres champs nécessaires pour l'image...
                });
                // Ajouter l'association à la table ProductImage
                await ProductImage.create({
                    ProductId: req.params.id,
                    ImageId: newImage.id // Utilisez l'ID de la nouvelle image
                });
            }
        }
        // Récupérer le produit mis à jour avec les images
        const updatedProduct = await Product.findByPk(req.params.id, { include: [{ model: Image, as: 'Images' }] });
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification du produit.", error });
    }
});
// Ajouter un produit au panier :
app.post('/cart', checkJwt, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const enterpriseId = req.user.EnterpriseId; // Récupérer l'EnterpriseId du token JWT
        if (!enterpriseId) {
            return res.status(400).json({ message: 'No enterprise associated with this user' });
        }
        // Chercher le panier lié à l'entreprise de l'utilisateur
        let cart = await Cart.findOne({ where: { EnterpriseId: enterpriseId } });
        // Si aucun panier n'est trouvé, en créer un nouveau
        if (!cart) {
            cart = await Cart.create({ EnterpriseId: enterpriseId });
        }
        // Si le panier est marqué comme payé, réinitialiser isPaid à false
        if (cart.isPaid) {
            await Cart.update({ isPaid: false }, { where: { id: cart.id } });
        }
        // Ajouter le produit au panier via la table de jointure ProductCart
        await ProductCart.create({
            CartId: cart.id,
            ProductId: productId,
            quantity
        });
        res.status(200).json({ message: 'Product added to cart' });
    }
    catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Error adding product to cart', error });
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
        res.status(404).json({ message: "Aucune entreprise trouvée avec cet id." });
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
app.post("/enterprise", checkJwt, async (req, res) => {
    try {
        // Vérifier le token JWT
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ msg: "Token non fourni" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        const userId = decoded.id; // Récupérer l'ID de l'utilisateur
        const newEnterprise = req.body;
        const enterprise = {
            name: newEnterprise.name,
            address: newEnterprise.address,
            siret: newEnterprise.siret,
            EnterpriseCategoryId: newEnterprise.EnterpriseCategoryId,
            ImageId: newEnterprise.ImageId
        };
        // Vérifier si la catégorie d'entreprise existe dans la BDD
        const enterpriseCategory = await EnterpriseCategory.findByPk(newEnterprise.EnterpriseCategoryId);
        if (!enterpriseCategory) {
            return res.status(400).json("Catégorie d'entreprise inexistante");
        }
        // Ajouter l'entreprise
        const createdEnterprise = await Enterprise.create(enterprise);
        // Mettre à jour l'utilisateur pour ajouter l'EnterpriseId
        await User.update({ EnterpriseId: createdEnterprise.id }, { where: { id: userId } });
        res.status(200).json(`${createdEnterprise.name} a été ajoutée à la liste des entreprises`);
    }
    catch (error) {
        console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
        res.status(500).json({ msg: "Erreur lors de l'ajout de l'entreprise", error });
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
            role: newUser.role,
            EnterpriseId: newUser.EnterpriseId,
            ImageId: 1
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
app.get("/productcategory/search/:text", async (req, res) => {
    const text = req.params.text.toLowerCase();
    try {
        const productCategories = await ProductCategory.findAll({
            where: {
                title: {
                    [Op.like]: `%${text}%`
                }
            }
        });
        productCategories.length > 0 ? res.status(200).json(productCategories) : res.status(404).json({ message: "Aucune catégorie trouvée avec cette entrée." });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des catégories." });
    }
});
app.post("/productcategory", async (req, res) => {
    try {
        const newCategory = req.body;
        const category = await ProductCategory.create({
            title: newCategory.title
        });
        res.status(200).json(category.title + " a été ajouté à la liste des catégories de produits");
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Erreur 500");
    }
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
app.get("/enterprisecategory/search/:text", async (req, res) => {
    const text = req.params.text.toLowerCase();
    try {
        const enterpriseCategories = await EnterpriseCategory.findAll({
            where: {
                title: {
                    [Op.like]: `%${text}%`
                }
            }
        });
        enterpriseCategories.length > 0 ? res.status(200).json(enterpriseCategories) : res.status(404).json({ message: "Aucune catégorie trouvée avec cette entrée." });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des catégories." });
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
//Gérer l'upload de plusieurs fichiers :
app.post("/upload", async (req, res) => {
    try {
        // Vérifier si des fichiers ont été envoyés
        if (!req.files || !req.files.images) {
            return res.status(400).json({ msg: "No images sent by the client" });
        }
        const images = req.files.images;
        const allowedExtensions = /jpg|jpeg|png|gif/;
        const uploadedImages = [];
        for (const image of images) {
            const extensionFile = path.extname(image.name).toLowerCase();
            if (!allowedExtensions.test(extensionFile)) {
                return res.status(400).json({ msg: "Invalid image format. Only JPG, PNG, and GIF are allowed." });
            }
            const fileName = path.basename(image.name, extensionFile);
            const completeFileName = `${fileName}_${Date.now()}${extensionFile}`;
            const uploadPath = path.join(__dirname, 'public', completeFileName);
            await image.mv(uploadPath);
            const newImage = await Image.create({
                url: `http://localhost:8051/${completeFileName}`
            });
            uploadedImages.push(newImage);
        }
        res.status(200).json({
            msg: 'Images uploaded and saved in database',
            images: uploadedImages
        });
    }
    catch (error) {
        res.status(500).json({ msg: "An error occurred", error });
    }
});
// Upload une seule image :
app.post("/upload-single", async (req, res) => {
    try {
        // Vérifier si un fichier a été envoyé
        if (!req.files || !req.files.image) {
            return res.status(400).json({ msg: "No image sent by the client" });
        }
        const image = req.files.image;
        const allowedExtensions = /jpg|jpeg|png|gif/;
        const extensionFile = path.extname(image.name).toLowerCase();
        // Vérifier l'extension du fichier
        if (!allowedExtensions.test(extensionFile)) {
            return res.status(400).json({ msg: "Invalid image format. Only JPG, PNG, and GIF are allowed." });
        }
        // Créer un nom de fichier unique
        const fileName = path.basename(image.name, extensionFile);
        const completeFileName = `${fileName}_${Date.now()}${extensionFile}`;
        const uploadPath = path.join(__dirname, 'public', completeFileName);
        // Déplacer l'image vers le dossier 'public'
        await image.mv(uploadPath);
        // Enregistrer l'image dans la base de données
        const newImage = await Image.create({
            url: `http://localhost:8051/${completeFileName}`
        });
        // Répondre avec les détails de l'image
        res.status(200).json({
            msg: 'Image uploaded and saved in database',
            image: newImage
        });
    }
    catch (error) {
        res.status(500).json({ msg: "An error occurred", error });
    }
});
app.get("/image/:id", async (req, res) => {
    const image = await Image.findByPk(req.params.id)
        .catch((error) => res.status(500).json("Erreur 500"));
    if (image) {
        res.status(200).json(image);
    }
    else {
        res.status(404).json({ message: "Aucune image trouvée avec cet id." });
    }
});
// Route pour obtenir les images d'un produit par son ID
app.get('/products/:id/images', async (req, res) => {
    const { id } = req.params;
    try {
        // Recherche du produit par son ID et inclusion des images associées
        const product = await Product.findByPk(id, {
            include: [{
                    model: Image,
                    as: 'Images', // Utilisation de l'alias pour l'association
                    through: { attributes: [] } // On ne récupère pas les colonnes de la table de jointure
                }]
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Retour des images associées
        res.json(product.Images);
    }
    catch (error) {
        console.error('An error occurred while fetching product images:', error);
        res.status(500).json({
            message: 'An error occurred while fetching product images',
            error: error.message
        });
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
    // Vérification des IDs
    if (!ProductId || !ImageId) {
        return res.status(400).json({ msg: "ProductId et ImageId sont requis" });
    }
    try {
        await ProductImage.create({ ProductId, ImageId });
        res.status(200).json({ msg: "Association produit-image réussie" });
    }
    catch (error) {
        res.status(500).json({ msg: "Erreur lors de l'association produit-image", error });
    }
});
// Route pour supprimer une image par son ID
app.delete('/images/:imageId', async (req, res) => {
    const { imageId } = req.params;
    try {
        const image = await Image.findByPk(imageId);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        await image.destroy();
        res.json({ message: 'Image deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the image', error });
    }
});
// ROUTE RECHERCHE GENERALE
app.get("/search/:text", async (req, res) => {
    const text = req.params.text.toLowerCase();
    try {
        // Recherche pour les produits
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${text}%` } },
                    { description: { [Op.like]: `%${text}%` } }
                ]
            }
        });
        // Recherche pour les entreprises
        const enterprises = await Enterprise.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${text}%` } },
                    { siret: text }
                ]
            }
        });
        // Recherche pour les catégories de produits
        const productCategories = await ProductCategory.findAll({
            where: {
                title: { [Op.like]: `%${text}%` }
            }
        });
        // Recherche pour les catégories d'entreprises
        const enterpriseCategories = await EnterpriseCategory.findAll({
            where: {
                title: { [Op.like]: `%${text}%` }
            }
        });
        const results = {
            products,
            enterprises,
            productCategories,
            enterpriseCategories
        };
        res.status(200).json(results);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche." });
    }
});
// ROUTES PANIER :
app.get("/cart/:enterpriseId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ where: { EnterpriseId: req.params.enterpriseId } });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        else {
            res.status(200).json(cart);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche." });
    }
});
// Nouvelle route pour obtenir les détails du panier
app.get("/cart/details/:enterpriseId", async (req, res) => {
    try {
        // Trouver le panier associé à l'EnterpriseId
        const cart = await Cart.findOne({ where: { EnterpriseId: req.params.enterpriseId } });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        // Récupérer les lignes du ProductCart où CartId correspond
        const productCartItems = await ProductCart.findAll({
            where: { CartId: cart.id },
            attributes: ['ProductId', 'quantity'] // Récupérer l'ID du produit et la quantité
        });
        // Si aucun produit n'est associé, retourner une réponse vide
        if (!productCartItems.length) {
            return res.status(200).json({
                cartId: cart.id,
                items: [],
                totalPrice: 0,
            });
        }
        // Créer un tableau pour stocker les informations du produit et des quantités
        const productsWithQuantities = [];
        for (const item of productCartItems) {
            // Pour chaque ligne de ProductCart, récupérer le produit associé
            const product = await Product.findOne({
                where: { id: item.ProductId },
                attributes: ['name', 'price', 'stock'] // Récupérer uniquement les attributs nécessaires
            });
            if (product) {
                // Ajouter les informations du produit et la quantité dans un tableau
                productsWithQuantities.push({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    quantity: item.quantity
                });
            }
        }
        // Calculer le prix total
        const totalPrice = productsWithQuantities.reduce((acc, item) => acc + item.quantity * item.price, 0);
        // Retourner les détails du panier
        res.status(200).json({
            cartId: cart.id,
            items: productsWithQuantities,
            totalPrice: totalPrice,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche." });
    }
});
// ROUTES PAIEMENT :
// Initialiser session Stripe
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { cartId } = req.body;
        // Récupérer l'ID de l'acheteur
        const currentCart = await Cart.findByPk(cartId);
        const buyerId = currentCart.EnterpriseId;
        // Récupérer les lignes du ProductCart où CartId correspond
        const productCartItems = await ProductCart.findAll({
            where: { CartId: cartId },
            attributes: ['ProductId', 'quantity'] // Récupérer uniquement l'ID du produit et la quantité
        });
        // Si aucun produit n'est trouvé, retourner une erreur
        if (!productCartItems.length) {
            return res.status(404).json({ message: 'No products found in the cart.' });
        }
        // Créer un tableau pour stocker les informations des produits et des quantités
        const productsWithQuantities = [];
        let totalPrice = 0;
        // Pour chaque ligne de ProductCart, récupérer les informations du produit
        for (const item of productCartItems) {
            const product = await Product.findOne({
                where: { id: item.ProductId },
                attributes: ['name', 'price', 'stock'] // Récupérer uniquement les attributs nécessaires
            });
            if (product) {
                // Calculer le prix total pour chaque produit
                const itemTotal = item.quantity * product.price;
                totalPrice += itemTotal;
                // Ajouter le produit et la quantité au tableau
                productsWithQuantities.push({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    quantity: item.quantity
                });
            }
        }
        // Mettre à jour le prix total dans la table Cart
        await Cart.update({ totalPrice }, { where: { id: cartId } });
        // Créer des éléments de ligne pour Stripe à partir des produits du panier
        const lineItems = productsWithQuantities.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // Stripe travaille en centimes
            },
            quantity: item.quantity,
        }));
        // Créer la session de paiement avec Stripe, en incluant CartId et buyerId dans les métadonnées
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            metadata: {
                cartId: cartId, // Inclure CartId dans les métadonnées
                buyerId: buyerId // Inclure buyerId dans les métadonnées
            },
            success_url: `http://localhost:4200/success`,
            cancel_url: `http://localhost:4200/cancel`,
        });
        // Retourner l'ID de la session Stripe
        res.json({ id: session.id });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la création de la session de paiement." });
    }
});
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const event = req.body;
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            // Récupérer CartId et buyerId à partir des métadonnées
            const cartId = session.metadata.cartId;
            const buyerId = session.metadata.buyerId;
            // Récupérer les lignes du ProductCart où CartId correspond
            const productCartItems = await ProductCart.findAll({
                where: { CartId: cartId },
                attributes: ['ProductId', 'quantity']
            });
            // Regrouper les produits par sellerId
            const ordersBySeller = {};
            for (const item of productCartItems) {
                const product = await Product.findByPk(item.ProductId);
                if (product) {
                    const sellerId = product.EnterpriseId;
                    // Si le sellerId n'existe pas dans l'objet, initialiser un tableau
                    if (!ordersBySeller[sellerId]) {
                        ordersBySeller[sellerId] = [];
                    }
                    // Ajouter le produit et sa quantité au tableau du seller
                    ordersBySeller[sellerId].push({
                        ProductId: item.ProductId,
                        quantity: item.quantity
                    });
                }
            }
            // Créer une commande pour chaque sellerId
            for (const sellerId in ordersBySeller) {
                const orderItems = ordersBySeller[sellerId];
                let totalPrice = 0;
                // Calculer le prix total pour cette commande
                for (const item of orderItems) {
                    const product = await Product.findByPk(item.ProductId);
                    if (product) {
                        totalPrice += product.price * item.quantity; // Calculer le montant total
                    }
                }
                // Créer la commande avec le totalPrice
                const order = await Order.create({
                    buyerId: buyerId,
                    sellerId: sellerId, // Définir le sellerId de la commande
                    status: 'WaitingForValidation',
                    totalPrice: totalPrice // Enregistrer le totalPrice
                });
                // Ajouter les produits de la commande
                for (const item of orderItems) {
                    await OrderProduct.create({
                        OrderId: order.id,
                        ProductId: item.ProductId,
                        quantity: item.quantity,
                    });
                }
                // Mettre à jour le stock pour chaque produit dans la commande
                for (const item of orderItems) {
                    await Product.decrement('stock', {
                        by: item.quantity,
                        where: { id: item.ProductId }
                    });
                }
            }
            // Mettre à jour l'attribut isPaid du panier
            await Cart.update({ isPaid: true }, { where: { id: cartId } });
            // Supprimer les lignes de ProductCart associées au cartId
            await ProductCart.destroy({
                where: { CartId: cartId },
            });
            console.log(`Cart with id ${cartId} has been marked as paid, emptied, and orders created for each seller.`);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send('Received');
});
// Routes Order
// Route pour récupérer les commandes d'une entreprise (en tant qu'acheteur ou vendeur)
app.get('/orders/:enterpriseId', async (req, res) => {
    const { enterpriseId } = req.params;
    try {
        // Chercher les commandes où l'utilisateur est soit le buyerId (acheteur), soit le sellerId (vendeur)
        const orders = await Order.findAll({
            where: {
                [Op.or]: [
                    { buyerId: enterpriseId }, // Commandes où l'utilisateur est l'acheteur
                    { sellerId: enterpriseId } // Commandes où l'utilisateur est le vendeur
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes.' });
    }
});
// Route pour mettre à jour le statut d'une commande
app.put('/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        order.status = status;
        await order.save();
        res.status(200).json({ message: 'Statut de la commande mis à jour avec succès' });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la commande' });
    }
});
// Routes pour les factures :
const waitForFile = (filePath, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const checkFileExists = () => {
            if (fs.existsSync(filePath)) {
                resolve();
            }
            else if (Date.now() - start >= timeout) {
                reject(new Error('File not found within timeout'));
            }
            else {
                setTimeout(checkFileExists, 100); // Re-vérifie toutes les 100ms
            }
        };
        checkFileExists();
    });
};
// Route pour générer facture 
app.get('/bill/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        // Récupérer la commande
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Vérifier si une facture existe déjà
        let bill = await Bill.findOne({ where: { OrderId: order.id } });
        if (bill) {
            // Vérifier si le fichier PDF correspondant existe déjà
            const filePath = path.join(__dirname, `./invoices/invoice_${bill.id}.pdf`);
            if (fs.existsSync(filePath)) {
                // Ajoutez des en-têtes pour éviter la mise en cache
                res.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
                res.set('Pragma', 'no-cache'); // HTTP 1.0.
                res.set('Expires', '0'); // Proxies.
                // Créer un paramètre unique pour éviter le cache
                const uniqueParam = new Date().getTime();
                return res.download(filePath, `Facture_${bill.id}.pdf?ts=${uniqueParam}`); // Télécharger la facture existante
            }
        }
        // Si la facture n'existe pas, la créer
        bill = await Bill.create({
            date: new Date(),
            totalPrice: order.totalPrice,
            OrderId: order.id,
            sellerId: order.sellerId,
            buyerId: order.buyerId
        });
        // Récupérer le vendeur et l'acheteur
        const seller = await Enterprise.findByPk(order.sellerId);
        const buyer = await Enterprise.findByPk(order.buyerId);
        // Récupérer les produits associés à la commande
        const orderProducts = await OrderProduct.findAll({
            where: { OrderId: order.id },
            attributes: ['ProductId', 'quantity']
        });
        // Récupérer les détails des produits
        const products = await Product.findAll({
            where: { id: orderProducts.map(item => item.ProductId) }
        });
        // Ajouter les produits à la facture
        for (const orderProduct of orderProducts) {
            const existingBillProduct = await BillProduct.findOne({
                where: {
                    BillId: bill.id,
                    ProductId: orderProduct.ProductId
                }
            });
            if (!existingBillProduct) {
                await BillProduct.create({
                    BillId: bill.id,
                    ProductId: orderProduct.ProductId,
                    quantity: orderProduct.quantity
                });
            }
        }
        // Générer le PDF
        const doc = new PDFDocument();
        const newFilePath = path.join(__dirname, `./invoices/invoice_${bill.id}.pdf`);
        doc.pipe(fs.createWriteStream(newFilePath));
        // Informations sur la facture
        doc.fontSize(20).text(`Facture N°: ${bill.id}`, { align: 'center' });
        doc.fontSize(12).text(`Date: ${bill.date.toLocaleDateString('fr-FR')}`, { align: 'center' });
        doc.moveDown();
        doc.moveDown();
        doc.fontSize(14).text(`Vendeur: ${seller.name}`, { align: 'left' });
        doc.text(`Adresse: ${seller.address}`, { align: 'left' });
        doc.text(`SIRET: ${seller.siret}`, { align: 'left' });
        doc.moveDown();
        doc.text(`Acheteur: ${buyer.name}`, { align: 'left' });
        doc.text(`Adresse: ${buyer.address}`, { align: 'left' });
        doc.text(`SIRET: ${buyer.siret}`, { align: 'left' });
        doc.moveDown();
        doc.moveDown();
        doc.text(`Numéro de commande : ${order.id} , le ${bill.date.toLocaleDateString('fr-FR')}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).font('Helvetica-Bold').text('Produits facturés:', { underline: true });
        doc.fontSize(14).font('Helvetica');
        doc.moveDown();
        // Détails des produits
        for (const orderProduct of orderProducts) {
            const product = products.find(p => p.id === orderProduct.ProductId);
            if (product) {
                const priceHT = (product.price * 0.8).toFixed(2);
                const priceTTC = product.price.toFixed(2);
                const totalProduitHT = (product.price * 0.8 * orderProduct.quantity).toFixed(2);
                const totalProduitTTC = (product.price * orderProduct.quantity).toFixed(2);
                const totalProduitTVA = (product.price * 0.2 * orderProduct.quantity).toFixed(2);
                doc.text(`Nom du produit: ${product.name}`);
                doc.text(`Référence produit: ${product.id}`);
                doc.text(`Quantité: ${orderProduct.quantity}`);
                doc.text(`Prix HT: ${priceHT}€ * ${orderProduct.quantity} = ${totalProduitHT}€`);
                doc.text(`Prix TTC: ${priceTTC}€ * ${orderProduct.quantity} = ${totalProduitTTC}€ (dont TVA 20%: ${totalProduitTVA} €)`);
                doc.moveDown();
                doc.text(`----------------------------------------`, { align: 'center' });
                doc.moveDown();
            }
        }
        // Total
        const totalPriceHT = (parseFloat(order.totalPrice) * 0.8).toFixed(2);
        const totalPriceTTC = parseFloat(order.totalPrice).toFixed(2);
        const totalTVA = (parseFloat(order.totalPrice) * 0.2).toFixed(2);
        doc.moveDown();
        doc.text(`------------------------------------------------------------------------------------------`, { align: 'center' });
        doc.moveDown();
        doc.moveDown();
        doc.text(`Total HT: ${totalPriceHT}€`, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(16).font('Helvetica-Bold')
            .text(`Total TTC: ${totalPriceTTC}€`, { align: 'center' });
        doc.fontSize(12).font('Helvetica')
            .text(`(dont TVA 20%: ${totalTVA} €)`, { align: 'center' });
        // Finaliser et fermer le PDF
        doc.end();
        // Attendre que le fichier soit créé avant de le renvoyer
        await waitForFile(newFilePath);
        // Ajoutez des en-têtes pour éviter la mise en cache
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
        res.set('Pragma', 'no-cache'); // HTTP 1.0.
        res.set('Expires', '0'); // Proxies.
        // Créer un paramètre unique
        const uniqueParam = new Date().getTime();
        return res.download(newFilePath, `Facture_${bill.id}.pdf?ts=${uniqueParam}`); // Télécharger la nouvelle facture
    }
    catch (error) {
        console.error('Error generating bill:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.listen(8051, () => {
    console.log("Youhouuuuu serveur lancé sur localhost:8051");
});
