import { Association } from "sequelize";
import { ProductCart } from "./ProductCart";

const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Sequelize, DataTypes, Op } = require("sequelize");

const login = {
    database: "gestion_stock",
    username: "admin",
    password: "admin"
};

// Connexion à la BDD
const sequelize = new Sequelize(login.database, login.username, login.password, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307,
    logging: false
});

// Vérifier la connexion
sequelize.authenticate()
    .then(() => console.log("Connexion à la base de données gestion_stock"))
    .catch(error => console.log(error));


module.exports = sequelize;
module.exports.Product = require("./Product");
module.exports.ProductCategory = require("./ProductCategory");
module.exports.User = require("./User");
module.exports.Role = require("./Role");
module.exports.Enterprise = require("./Enterprise");
module.exports.EnterpriseCategory = require("./EnterpriseCategory");
module.exports.Image = require("./Image");
module.exports.Bill = require("./Bill");
module.exports.BillProduct = require("./BillProduct");
module.exports.Carac = require("./Carac");
module.exports.CaracProduct = require("./CaracProduct");
module.exports.Cart = require("./Cart");
module.exports.Order = require("./Order");
module.exports.OrderProduct = require("./OrderProduct");
module.exports.ProductCart = require("./ProductCart");
module.exports.ProductImage = require("./ProductImage");



sequelize.sync({ force: true })
    .then(async () => {
        console.log("Les modèles et les tables sont synchronisés.");


        const Product = sequelize.models.Product;
        const Enterprise = sequelize.models.Enterprise;
        const productCategory = sequelize.models.ProductCategory;
        const enterpriseCategory = sequelize.models.EnterpriseCategory;
        const user = sequelize.models.User;
        const image = sequelize.models.Image;

        const jerem = await user.create({ firstName: "Jeremie", lastName: "Laroche", password: "Ricard4ever", email: "j@jerem.fr", role: "Admin" });
        const mireille = await user.create({ firstName: "Mireille", lastName: "Labeille", password: "mmmmm", email: "mir@mir.fr", role: "Gestionnaire" });
        const stockEZ = await Enterprise.create({ 
            name: "Stock'EZ", 
            address: "8 rue d'Hozier", 
            siret: 131313131313, 
            iban: 12345678901291536 
        });
        const categoryStockEZ = await enterpriseCategory.create({ title: "Gestion" });
        const imageStockEZ = await image.create({ url: "https://i.ibb.co/rQhHc7p/stockEZ.png" });

        await categoryStockEZ.addEnterprise(stockEZ);
        await imageStockEZ.setEnterprise(stockEZ);
        await stockEZ.addUser(jerem);

        const entreprises = await Enterprise.bulkCreate([
            { 
                name: "La Poste", 
                address: "12 rue du Courrier", 
                siret: 987654321, 
                iban: 12345678901234567 
            },
            { 
                name: "Tech Valley", 
                address: "24 Avenue des Startups", 
                siret: 123987456, 
                iban: 23456789012345678 
            },
            { 
                name: "Mobilité Durable", 
                address: "56 rue des Voitures Electriques", 
                siret: 321654987, 
                iban: 34567890123456789 
            },
            { 
                name: "InnoTech", 
                address: "107 rue de l'Innovation", 
                siret: 654321789, 
                iban: 45678901234567890
            },
            { 
                name: "Eco Solutions", 
                address: "203 Allée Verte", 
                siret: 789456123, 
                iban: 56789012345678901
            }
        ]);
        

        const produits1 = await Product.bulkCreate([
            { name: "Peugeot 308", price: 15000, description: "Voiture compacte", isFavorite: 0, stock: 30, EnterpriseId: entreprises[0].id },
            { name: "Tesla Model 3", price: 50000, description: "Voiture électrique", isFavorite: 1, stock: 15, EnterpriseId: entreprises[0].id },
            { name: "Ford Mustang", price: 45000, description: "Voiture sportive", isFavorite: 1, stock: 5, EnterpriseId: entreprises[0].id },
            { name: "Fiat Panda", price: 8000, description: "Petite citadine", isFavorite: 0, stock: 100, EnterpriseId: entreprises[0].id },
            { name: "BMW Série 5", price: 60000, description: "Berline de luxe", isFavorite: 1, stock: 8, EnterpriseId: entreprises[0].id },
            { name: "Audi A4", price: 35000, description: "Berline sportive", isFavorite: 0, stock: 20, EnterpriseId: entreprises[0].id },
            { name: "Mercedes Classe A", price: 32000, description: "Compacte premium", isFavorite: 1, stock: 12, EnterpriseId: entreprises[0].id },
            { name: "Renault Clio", price: 12000, description: "Best-seller en France", isFavorite: 1, stock: 50, EnterpriseId: entreprises[0].id },
            { name: "Nissan Leaf", price: 30000, description: "Compacte électrique", isFavorite: 0, stock: 25, EnterpriseId: entreprises[0].id },
            { name: "Porsche 911", price: 90000, description: "Voiture de sport", isFavorite: 1, stock: 3, EnterpriseId: entreprises[0].id }
        ]);

        const produits2 = await Product.bulkCreate([
            { name: "Dell XPS 13", price: 1500, description: "Ultrabook compact", isFavorite: 1, stock: 50, EnterpriseId: entreprises[1].id },
            { name: "MacBook Pro 14", price: 2500, description: "Laptop puissant", isFavorite: 1, stock: 30, EnterpriseId: entreprises[1].id },
            { name: "Asus Zenbook", price: 1200, description: "Ultraportable performant", isFavorite: 0, stock: 40, EnterpriseId: entreprises[1].id },
            { name: "HP Spectre x360", price: 1400, description: "Laptop convertible", isFavorite: 0, stock: 20, EnterpriseId: entreprises[1].id },
            { name: "Acer Nitro 5", price: 1100, description: "PC gaming abordable", isFavorite: 1, stock: 35, EnterpriseId: entreprises[1].id },
            { name: "Lenovo ThinkPad", price: 1800, description: "Laptop professionnel", isFavorite: 0, stock: 25, EnterpriseId: entreprises[1].id },
            { name: "MSI GS65 Stealth", price: 2000, description: "Laptop gaming premium", isFavorite: 1, stock: 15, EnterpriseId: entreprises[1].id },
            { name: "Razer Blade", price: 2400, description: "Laptop gaming ultra fin", isFavorite: 1, stock: 10, EnterpriseId: entreprises[1].id },
            { name: "Microsoft Surface Laptop", price: 1500, description: "Laptop pour étudiants", isFavorite: 1, stock: 60, EnterpriseId: entreprises[1].id },
            { name: "Google Pixelbook", price: 1300, description: "Chromebook haut de gamme", isFavorite: 0, stock: 50, EnterpriseId: entreprises[1].id }
        ]);

        const produits3 = await Product.bulkCreate([
            { name: "Samsung Galaxy S22", price: 900, description: "Smartphone haut de gamme", isFavorite: 1, stock: 100, EnterpriseId: entreprises[2].id },
            { name: "iPhone 14", price: 1200, description: "Dernier modèle Apple", isFavorite: 1, stock: 75, EnterpriseId: entreprises[2].id },
            { name: "OnePlus 9 Pro", price: 850, description: "Flagship killer", isFavorite: 0, stock: 50, EnterpriseId: entreprises[2].id },
            { name: "Google Pixel 7", price: 800, description: "Smartphone Android pur", isFavorite: 1, stock: 60, EnterpriseId: entreprises[2].id },
            { name: "Xiaomi Mi 11", price: 700, description: "Smartphone abordable et puissant", isFavorite: 0, stock: 150, EnterpriseId: entreprises[2].id },
            { name: "Huawei P40 Pro", price: 1000, description: "Photophone exceptionnel", isFavorite: 1, stock: 30, EnterpriseId: entreprises[2].id },
            { name: "Oppo Find X5", price: 950, description: "Smartphone design et performant", isFavorite: 1, stock: 40, EnterpriseId: entreprises[2].id },
            { name: "Sony Xperia 5 II", price: 800, description: "Smartphone multimédia", isFavorite: 0, stock: 20, EnterpriseId: entreprises[2].id },
            { name: "Nokia 8.3", price: 650, description: "Smartphone 5G", isFavorite: 0, stock: 80, EnterpriseId: entreprises[2].id },
            { name: "Motorola Edge", price: 750, description: "Smartphone avec écran incurvé", isFavorite: 1, stock: 30, EnterpriseId: entreprises[2].id }
        ]);

        const produits4 = await Product.bulkCreate([
            { name: "Apple iMac", price: 2000, description: "Ordinateur de bureau", isFavorite: 1, stock: 20, EnterpriseId: entreprises[3].id },
            { name: "Dell Inspiron", price: 1200, description: "PC de bureau", isFavorite: 1, stock: 30, EnterpriseId: entreprises[3].id },
            { name: "HP Omen", price: 1500, description: "PC gamer", isFavorite: 1, stock: 15, EnterpriseId: entreprises[3].id },
            { name: "Lenovo IdeaCentre", price: 1000, description: "PC tout-en-un", isFavorite: 1, stock: 25, EnterpriseId: entreprises[3].id },
            { name: "Asus ROG", price: 2500, description: "PC gaming", isFavorite: 1, stock: 10, EnterpriseId: entreprises[3].id },
            { name: "Acer Aspire", price: 900, description: "PC polyvalent", isFavorite: 1, stock: 35, EnterpriseId: entreprises[3].id },
            { name: "Microsoft Surface Studio", price: 3000, description: "PC créatif", isFavorite: 1, stock: 5, EnterpriseId: entreprises[3].id },
            { name: "Razer Blade Stealth", price: 2200, description: "Ultrabook gaming", isFavorite: 1, stock: 10, EnterpriseId: entreprises[3].id },
            { name: "Samsung Galaxy Book", price: 1300, description: "Laptop léger", isFavorite: 1, stock: 20, EnterpriseId: entreprises[3].id },
            { name: "HP Elite Dragonfly", price: 1800, description: "Ultraportable professionnel", isFavorite: 1, stock: 15, EnterpriseId: entreprises[3].id }
        ]);

        const produits5 = await Product.bulkCreate([
            { name: "Smart TV LG", price: 1200, description: "Télévision 4K", isFavorite: 1, stock: 25, EnterpriseId: entreprises[4].id },
            { name: "Sony Bravia", price: 1500, description: "Télévision OLED", isFavorite: 1, stock: 20, EnterpriseId: entreprises[4].id },
            { name: "Samsung QLED", price: 1300, description: "Télévision haut de gamme", isFavorite: 1, stock: 30, EnterpriseId: entreprises[4].id },
            { name: "Philips Ambilight", price: 1100, description: "Télévision immersive", isFavorite: 1, stock: 15, EnterpriseId: entreprises[4].id },
            { name: "TCL 6 Series", price: 900, description: "Télévision abordable", isFavorite: 1, stock: 50, EnterpriseId: entreprises[4].id },
            { name: "LG NanoCell", price: 1400, description: "Télévision de haute qualité", isFavorite: 1, stock: 20, EnterpriseId: entreprises[4].id },
            { name: "Vizio M-Series", price: 800, description: "Télévision avec son surround", isFavorite: 1, stock: 35, EnterpriseId: entreprises[4].id },
            { name: "Roku Smart TV", price: 750, description: "Télévision intelligente", isFavorite: 1, stock: 45, EnterpriseId: entreprises[4].id },
            { name: "Hisense 4K", price: 700, description: "Télévision 4K économique", isFavorite: 1, stock: 60, EnterpriseId: entreprises[4].id },
            { name: "Sanyo LED", price: 600, description: "Télévision LED de base", isFavorite: 1, stock: 80, EnterpriseId: entreprises[4].id }
        ]);

        const categoriesProduits = await productCategory.bulkCreate([
            { title: "Automobile" },
            { title: "Informatique" },
            { title: "Télécommunications" },
            { title: "Audiovisuel" },
            { title: "Électroménager" },
            { title: "Sport et Loisirs" },
            { title: "Beauté et Santé" },
            { title: "Alimentation" },
            { title: "Bricolage et Jardinage" },
            { title: "Mode et Accessoires" },
            { title: "Jouets et Jeux" },
            { title: "Papeterie" },
            { title: "Équipements de bureau" },
            { title: "Mobilier" }
        ]);
        
        const categoriesEntreprises = await enterpriseCategory.bulkCreate([
            { title: "Logistique" },
            { title: "Technologie" },
            { title: "Mobilité" },
            { title: "Énergies Vertes" },
            { title: "Santé" },
            { title: "Éducation" },
            { title: "Finance et Assurance" },
            { title: "Hôtellerie et Restauration" },
            { title: "Bâtiment et Travaux Publics" },
            { title: "Agriculture et Agroalimentaire" },
            { title: "Média et Divertissement" },
            { title: "Services juridiques" },
            { title: "Tourisme" },
            { title: "Art et Culture" }
        ]);
        

        const users = await user.bulkCreate([
            { firstName: "Jean", lastName: "Bonbeurre", password: "jjjjj", email: "jean@jean.fr", role: "Employee" },
            { firstName: "Alice", lastName: "Dupont", password: "abcdef", email: "alice@example.com", role: "Gestionnaire" },
            { firstName: "Paul", lastName: "Martin", password: "pass123", email: "paul@example.com", role: "Gestionnaire" },
            { firstName: "Sara", lastName: "Dubois", password: "mypassword", email: "sara@example.com", role: "Employee" },
            { firstName: "Louis", lastName: "Bernard", password: "louispass", email: "louis@example.com", role: "Employee" }
        ]);

        const imagesEnterprise = await image.bulkCreate([
            { url: "https://assets.codepen.io/1480814/av+1.png" },
            { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7EeWjxCLjNt6p7GnhBw5jXiXVA9pBDFe-NQ&s" },
            { url: "https://techvalley.pk/wp-content/uploads/2022/06/cropped-WhatsApp-Image-2022-06-08-at-12.01.19-AM.jpeg" },
            { url: "https://cdn.prod.website-files.com/6196216899614102596abf17/625eab94ec2f46d32a83b3ed_mobilite.jpg" },
            { url: "https://albertainnovates.ca/wp-content/smush-webp/2023/06/InnoTech-Logo-for-rounded-corners-white-1200x675.png.webp" },
            { url: "https://ecosolutions.com.tr/wp-content/uploads/2021/09/Varlik-1.png" }
        ]);

        // Définir un avatar par défaut
        const defaultImage = await image.findOrCreate({
            where: { url: "https://assets.codepen.io/1480814/av+1.png" },
            defaults: { url: "https://assets.codepen.io/1480814/av+1.png" }
        });

        // Met à jour tous les utilisateurs qui n'ont pas encore d'image associée
        await user.update({ ImageId: defaultImage[0].id }, {
            where: {
                ImageId: null
            }
        });

        // Lien produits et entreprises avec les catégories
        await categoriesProduits[0].addProducts(produits1); // Automobile
        await categoriesProduits[1].addProducts(produits2); // Informatique
        await categoriesProduits[2].addProducts(produits3); // Télécommunications
        await categoriesProduits[1].addProducts(produits4); // Informatique
        await categoriesProduits[3].addProducts(produits5); // Audiovisuel

        await categoriesEntreprises[0].addEnterprises([entreprises[0]]); // La Poste - Logistique
        await categoriesEntreprises[1].addEnterprises([entreprises[1], entreprises[3]]); // Tech Valley & InnoTech - Technologie
        await categoriesEntreprises[2].addEnterprises([entreprises[2]]); // Mobilité Durable - Mobilité
        await categoriesEntreprises[3].addEnterprises([entreprises[4]]); // Eco Solutions - Énergies Vertes

        // Lien entreprises / images
        await imagesEnterprise[1].setEnterprise(entreprises[0]);
        await imagesEnterprise[2].setEnterprise(entreprises[1]);
        await imagesEnterprise[3].setEnterprise(entreprises[2]);
        await imagesEnterprise[4].setEnterprise(entreprises[3]);
        await imagesEnterprise[5].setEnterprise(entreprises[4]);

        // Lier utilisateurs à leurs entreprises
        await entreprises[0].addUser(users[0]); // Jean - La Poste
        await entreprises[1].addUser(users[1]); // Alice - Tech Valley
        await entreprises[2].addUser(users[2]); // Paul - Mobilité Durable
        await entreprises[3].addUser(users[3]); // Sara - InnoTech
        await entreprises[4].addUser(users[4]); // Louis - Eco Solutions

        await entreprises[0].addUser(mireille); // Mireille - La Poste
    })
