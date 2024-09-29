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

const bcrypt = require('bcrypt');
const saltRounds = 10;
const fileUpload = require("express-fileupload");
const path = require('path');

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(fileUpload());

import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET;

import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

app.use(bodyParser.json());

// Middleware pour vérifier le JWT
const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Extraire le token (sans le mot 'Bearer')
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded; 
        next();
    });
};

// Route protégée par JWT
app.get('/protected', checkJwt, (req: Request, res: Response) => {
    res.json({ message: 'You are authorized', user: req.body.user });
});

// Route de login pour générer un token JWT
app.post('/login', async (req: Request, res: Response) => {
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
        let payload: any = { 
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
        const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Récupérer un utilisateur grâce au token :
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ msg: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) return res.status(403).json({ msg: "Invalid token" });

        req.user = user;  // Ajouter l'utilisateur au requête pour l'utiliser plus tard
        next();
    });
};


// ROUTES DE PRODUIT :

app.get("/products", async (req, res) => {

    try {
        const products = await Product.findAll();

        products.length > 0 ? res.status(200).json(products) : res.status(404).json({ message: "Aucun produit" });

    } catch (error) {
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
        } else {
            res.status(404).json({ message: "Aucun Produit trouvé avec cet id." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
    }
});


app.get("/products/category/:productCategoryId", async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                ProductCategoryId : req.params.productCategoryId
            }
        })
        if (products) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: "Aucun Produit trouvé avec cette categoryId." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
    }
});

app.get("/products/enterprise/:enterpriseId", async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                EnterpriseId : req.params.enterpriseId
            }
        })
        if (products) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: "Aucun Produit trouvé avec cette entreprise." });
        }
    } catch (error) {
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
                    }
                    ,
                    {
                        description: {
                            [Op.like]: `%${text}%`
                        }
                    }
                ]
            }
        });

        products.length > 0 ? res.status(200).json(products) : res.status(404).json({ message: "Aucun Produit trouvé avec cette entrée." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
    }
});

app.post('/product', authenticateToken, async (req, res) => {
    const userId = req.user.id;  // Récupérer l'id de l'utilisateur depuis le token JWT
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
            EnterpriseId: user.EnterpriseId  // Associer directement l'EnterpriseId récupéré
        });
        res.json(product);
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification du produit.", error });
    }
});

//ajouter un produit au panier :
app.post('/cart', checkJwt, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const enterpriseId = req.user.EnterpriseId;  // Récupérer l'EnterpriseId du token JWT

        if (!enterpriseId) {
            return res.status(400).json({ message: 'No enterprise associated with this user' });
        }

        // Chercher le panier lié à l'entreprise de l'utilisateur
        let cart = await Cart.findOne({ where: { EnterpriseId: enterpriseId } });

        // Si aucun panier n'est trouvé, en créer un nouveau
        if (!cart) {
            cart = await Cart.create({ EnterpriseId: enterpriseId });
        }

        // Ajouter le produit au panier via la table de jointure ProductCart
        await ProductCart.create({
            CartId: cart.id,
            ProductId: productId,
            quantity
        });

        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Error adding product to cart', error });
    }
});



// ROUTES POUR LES ENTREPRISES :


app.get("/enterprises", async (req, res) => {

    try {
        const enterprises = await Enterprise.findAll();

        enterprises.length > 0 ? res.status(200).json(enterprises) : res.status(404).json({ message: "Aucune entreprise" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des entreprises." });
    }
});


app.get("/enterprise/:id", async (req, res) => {
    const enterprise = await Enterprise.findByPk(req.params.id)
        .catch((error) => res.status(500).json("Erreur 500"));
    if (enterprise) {
        res.status(200).json(enterprise);
    } else {
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
                    }
                    ,
                    {
                        siret: text
                    }
                ]
            }
        });

        enterprises.length > 0 ? res.status(200).json(enterprises) : res.status(404).json({ message: "Aucune entreprise trouvé avec cette entrée." });

    } catch (error) {
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

        const decoded = jwt.verify(token, secretKey);
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
        await User.update(
            { EnterpriseId: createdEnterprise.id },
            { where: { id: userId } }
        );

        res.status(200).json(`${createdEnterprise.name} a été ajoutée à la liste des entreprises`);
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de l'entreprise." });
    }
});




// ROUTES POUR LES USERS :

app.get("/users", async (req, res) => {

    try {
        const users = await User.findAll();

        users.length > 0 ? res.status(200).json(users) : res.status(404).json({ message: "Aucun User" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des users." });
    }
});


app.get("/user/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id)
        .catch((error) => res.status(500).json("Erreur 500"));
    if (user) {
        res.status(200).json(user);
    } else {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur." });
    }
});


// ROUTES PRODUCTCATEGORIES :


app.get("/productcategories", async (req, res) => {
    try {
        const categories = await ProductCategory.findAll();
        categories != undefined ? res.status(200).json(categories) : res.status(400).json({ message: "Erreur 400" });
    } catch (error) {
        console.log(error);
        res.status(500).json("erreur 500");
    }
})


app.get("/productcategory/:id", async (req, res) => {
    try {
        const category = await ProductCategory.findByPk(req.params.id);
        category != undefined ? res.status(200).json(category) : res.status(400).json({ message: "Erreur 400" });
    } catch (error) {
        console.log(error);
        res.status(500).json("Erreur 500");
    }
});

app.get("/productcategory/search/:text", async (req, res) => {
    const text = req.params.text.toLowerCase();
    try {
        const productCategories = await ProductCategory.findAll({
            where: 
                    {
                        title: {
                            [Op.like]: `%${text}%`
                        }
                    }         
        });

        productCategories.length > 0 ? res.status(200).json(productCategories) : res.status(404).json({ message: "Aucune catégorie trouvée avec cette entrée." });

    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de la catégorie." });
    }
});


// ROUTES ENTERPRISECATEGORIES :

app.get("/enterprisecategories", async (req, res) => {
    try {
        const categories = await EnterpriseCategory.findAll();
        categories != undefined ? res.status(200).json(categories) : res.status(400).json({ message: "Erreur 400" });
    } catch (error) {
        console.log(error);
        res.status(500).json("erreur 500");
    }
})


app.get("/enterprisecategory/:id", async (req, res) => {
    try {
        const category = await EnterpriseCategory.findByPk(req.params.id);
        category != undefined ? res.status(200).json(category) : res.status(400).json({ message: "Erreur 400" });
    } catch (error) {
        console.log(error);
        res.status(500).json("Erreur 500");
    }
});

app.get("/enterprisecategory/search/:text", async (req, res) => {
    const text = req.params.text.toLowerCase();
    try {
        const enterpriseCategories = await EnterpriseCategory.findAll({
            where: 
                    {
                        title: {
                            [Op.like]: `%${text}%`
                        }
                    }         
        });

        enterpriseCategories.length > 0 ? res.status(200).json(enterpriseCategories) : res.status(404).json({ message: "Aucune catégorie trouvée avec cette entrée." });

    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
        res.status(500).json({ msg: "An error occurred", error });
    }
});


app.get("/image/:id", async (req, res) => {
    const image = await Image.findByPk(req.params.id)
        .catch((error) => res.status(500).json("Erreur 500"));
    if (image) {
        res.status(200).json(image);
    } else {
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
    } catch (error) {
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
    } catch (error) {
        res.status(500).json({ msg: "Erreur lors de l'ajout d'image" });
    }
})


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
    } catch (error) {
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
    } catch (error) {
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

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche." });
    }
});


// ROUTES PANIER :

app.get("/cart/:enterpriseId", async (req,res) => {
    try {
        const cart = await Cart.findOne({ where: { EnterpriseId: req.params.enterpriseId }});

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        } else {
            res.status(200).json(cart);
        }

    } catch(error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche." });
    }
})


app.listen(8051, () => {
    console.log("Youhouuuuu serveur lancé sur localhost:8051");
});
