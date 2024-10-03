"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    const productImage = sequelize.models.ProductImage;
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
    const newEnterprises = await Enterprise.bulkCreate([
        {
            name: "Green Energy Solutions",
            address: "18 rue des Énergies",
            siret: 987456321,
            iban: 22345678901234567,
            EnterpriseCategoryId: categoriesEntreprises[3].id // Énergies Vertes
        },
        {
            name: "HealthCare Innovations",
            address: "30 Avenue de la Santé",
            siret: 654789321,
            iban: 98765432101234567,
            EnterpriseCategoryId: categoriesEntreprises[4].id // Santé
        },
        {
            name: "EducTech Pro",
            address: "22 rue de l'Éducation",
            siret: 321954987,
            iban: 56789012345618901,
            EnterpriseCategoryId: categoriesEntreprises[5].id // Éducation
        },
        {
            name: "AssurePlus",
            address: "14 rue de la Finance",
            siret: 789123654,
            iban: 98765432109876543,
            EnterpriseCategoryId: categoriesEntreprises[6].id // Finance et Assurance
        },
        {
            name: "Urban Construction",
            address: "48 rue des Travaux",
            siret: 963852741,
            iban: 13579246801357924,
            EnterpriseCategoryId: categoriesEntreprises[8].id // Bâtiment et Travaux Publics
        }
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
        { url: "https://ecosolutions.com.tr/wp-content/uploads/2021/09/Varlik-1.png" },
        { url: "https://www.gstatic.com/webp/gallery/1.jpg" },
        { url: "https://www.gstatic.com/webp/gallery/2.jpg" },
        { url: "https://www.gstatic.com/webp/gallery/3.jpg" },
        { url: "https://www.gstatic.com/webp/gallery/4.jpg" },
        { url: "https://www.gstatic.com/webp/gallery/5.jpg" },
        { url: "https://images.pexels.com/photos/169320/pexels-photo-169320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1166789/pexels-photo-1166789.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1031237/pexels-photo-1031237.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4604115/pexels-photo-4604115.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/738234/pexels-photo-738234.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/350364/pexels-photo-350364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3671512/pexels-photo-3671512.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2724740/pexels-photo-2724740.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2361185/pexels-photo-2361185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1642770/pexels-photo-1642770.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3258763/pexels-photo-3258763.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4185329/pexels-photo-4185329.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2916330/pexels-photo-2916330.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3560466/pexels-photo-3560466.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1241964/pexels-photo-1241964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2673015/pexels-photo-2673015.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/5691546/pexels-photo-5691546.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6123683/pexels-photo-6123683.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2601115/pexels-photo-2601115.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3628074/pexels-photo-3628074.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3766356/pexels-photo-3766356.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3051916/pexels-photo-3051916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2803133/pexels-photo-2803133.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3501715/pexels-photo-3501715.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2228516/pexels-photo-2228516.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1282369/pexels-photo-1282369.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2083193/pexels-photo-2083193.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3825525/pexels-photo-3825525.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2659151/pexels-photo-2659151.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2077691/pexels-photo-2077691.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7362820/pexels-photo-7362820.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/5082111/pexels-photo-5082111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3766036/pexels-photo-3766036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4618367/pexels-photo-4618367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1346483/pexels-photo-1346483.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4227335/pexels-photo-4227335.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4740000/pexels-photo-4740000.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3879057/pexels-photo-3879057.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2769784/pexels-photo-2769784.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3807693/pexels-photo-3807693.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3738517/pexels-photo-3738517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3770583/pexels-photo-3770583.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2503936/pexels-photo-2503936.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3164918/pexels-photo-3164918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3271560/pexels-photo-3271560.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1151858/pexels-photo-1151858.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2759252/pexels-photo-2759252.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3171005/pexels-photo-3171005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2479211/pexels-photo-2479211.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3816910/pexels-photo-3816910.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3012610/pexels-photo-3012610.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3518281/pexels-photo-3518281.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2486165/pexels-photo-2486165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3019225/pexels-photo-3019225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2478465/pexels-photo-2478465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4161606/pexels-photo-4161606.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3059084/pexels-photo-3059084.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3059050/pexels-photo-3059050.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1300587/pexels-photo-1300587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3058232/pexels-photo-3058232.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2024246/pexels-photo-2024246.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1651075/pexels-photo-1651075.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1032467/pexels-photo-1032467.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1127165/pexels-photo-1127165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2814285/pexels-photo-2814285.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1751189/pexels-photo-1751189.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3104228/pexels-photo-3104228.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4104946/pexels-photo-4104946.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2939081/pexels-photo-2939081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2225064/pexels-photo-2225064.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2752995/pexels-photo-2752995.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4006724/pexels-photo-4006724.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3533693/pexels-photo-3533693.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2271340/pexels-photo-2271340.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2474465/pexels-photo-2474465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2219291/pexels-photo-2219291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2200240/pexels-photo-2200240.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1876610/pexels-photo-1876610.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2087458/pexels-photo-2087458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2381522/pexels-photo-2381522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3201216/pexels-photo-3201216.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2467659/pexels-photo-2467659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2951644/pexels-photo-2951644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2554613/pexels-photo-2554613.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2461643/pexels-photo-2461643.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1354876/pexels-photo-1354876.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2121314/pexels-photo-2121314.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4228190/pexels-photo-4228190.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2163951/pexels-photo-2163951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4082386/pexels-photo-4082386.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2795682/pexels-photo-2795682.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1344545/pexels-photo-1344545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3059735/pexels-photo-3059735.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2281845/pexels-photo-2281845.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3023731/pexels-photo-3023731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3710346/pexels-photo-3710346.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1461115/pexels-photo-1461115.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2906572/pexels-photo-2906572.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3562437/pexels-photo-3562437.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3188824/pexels-photo-3188824.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3265512/pexels-photo-3265512.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1607941/pexels-photo-1607941.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1853017/pexels-photo-1853017.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1927126/pexels-photo-1927126.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3817120/pexels-photo-3817120.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3441384/pexels-photo-3441384.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4152874/pexels-photo-4152874.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2039264/pexels-photo-2039264.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4054099/pexels-photo-4054099.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1967604/pexels-photo-1967604.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4218790/pexels-photo-4218790.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1787525/pexels-photo-1787525.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3937767/pexels-photo-3937767.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2398886/pexels-photo-2398886.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3773100/pexels-photo-3773100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1583485/pexels-photo-1583485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3718909/pexels-photo-3718909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1915421/pexels-photo-1915421.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1968174/pexels-photo-1968174.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1769204/pexels-photo-1769204.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2291608/pexels-photo-2291608.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3094810/pexels-photo-3094810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1994454/pexels-photo-1994454.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2858455/pexels-photo-2858455.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3499063/pexels-photo-3499063.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3158721/pexels-photo-3158721.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3624637/pexels-photo-3624637.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2169322/pexels-photo-2169322.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2178858/pexels-photo-2178858.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3201173/pexels-photo-3201173.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1451883/pexels-photo-1451883.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3150798/pexels-photo-3150798.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1867727/pexels-photo-1867727.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1872784/pexels-photo-1872784.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3644057/pexels-photo-3644057.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2573048/pexels-photo-2573048.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1645359/pexels-photo-1645359.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1558438/pexels-photo-1558438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2367765/pexels-photo-2367765.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4349645/pexels-photo-4349645.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4403021/pexels-photo-4403021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4513520/pexels-photo-4513520.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1930830/pexels-photo-1930830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4184079/pexels-photo-4184079.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4109097/pexels-photo-4109097.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3247454/pexels-photo-3247454.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3026736/pexels-photo-3026736.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3299964/pexels-photo-3299964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4269436/pexels-photo-4269436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2988861/pexels-photo-2988861.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2516003/pexels-photo-2516003.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2538774/pexels-photo-2538774.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2667093/pexels-photo-2667093.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2989144/pexels-photo-2989144.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2351894/pexels-photo-2351894.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1762160/pexels-photo-1762160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4084687/pexels-photo-4084687.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2203468/pexels-photo-2203468.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1818018/pexels-photo-1818018.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2364774/pexels-photo-2364774.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3701801/pexels-photo-3701801.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2393034/pexels-photo-2393034.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4128684/pexels-photo-4128684.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2990742/pexels-photo-2990742.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2600807/pexels-photo-2600807.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2872477/pexels-photo-2872477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1738430/pexels-photo-1738430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4536573/pexels-photo-4536573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1910640/pexels-photo-1910640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2901752/pexels-photo-2901752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2447098/pexels-photo-2447098.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3560584/pexels-photo-3560584.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3560280/pexels-photo-3560280.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2759821/pexels-photo-2759821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2419902/pexels-photo-2419902.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2898488/pexels-photo-2898488.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4146573/pexels-photo-4146573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4240476/pexels-photo-4240476.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4371972/pexels-photo-4371972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3152036/pexels-photo-3152036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3468463/pexels-photo-3468463.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3588904/pexels-photo-3588904.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4407560/pexels-photo-4407560.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3611324/pexels-photo-3611324.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2466829/pexels-photo-2466829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3894933/pexels-photo-3894933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3835201/pexels-photo-3835201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4523992/pexels-photo-4523992.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3070881/pexels-photo-3070881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2658524/pexels-photo-2658524.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2868475/pexels-photo-2868475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1461590/pexels-photo-1461590.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3848964/pexels-photo-3848964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4032732/pexels-photo-4032732.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2287718/pexels-photo-2287718.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4348928/pexels-photo-4348928.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2332362/pexels-photo-2332362.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4348879/pexels-photo-4348879.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4262978/pexels-photo-4262978.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4211915/pexels-photo-4211915.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4134454/pexels-photo-4134454.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3560566/pexels-photo-3560566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4133174/pexels-photo-4133174.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4050461/pexels-photo-4050461.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4558840/pexels-photo-4558840.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4333246/pexels-photo-4333246.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3652635/pexels-photo-3652635.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4525716/pexels-photo-4525716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4008428/pexels-photo-4008428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2828971/pexels-photo-2828971.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1612370/pexels-photo-1612370.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4262922/pexels-photo-4262922.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2467070/pexels-photo-2467070.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2290135/pexels-photo-2290135.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/10000402/pexels-photo-10000402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/11466513/pexels-photo-11466513.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4604286/pexels-photo-4604286.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4827105/pexels-photo-4827105.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7219739/pexels-photo-7219739.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/8144915/pexels-photo-8144915.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/11678664/pexels-photo-11678664.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7648454/pexels-photo-7648454.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/9142411/pexels-photo-9142411.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/8681502/pexels-photo-8681502.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7229820/pexels-photo-7229820.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/10216457/pexels-photo-10216457.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7590816/pexels-photo-7590816.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6481441/pexels-photo-6481441.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7338382/pexels-photo-7338382.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6145992/pexels-photo-6145992.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6518638/pexels-photo-6518638.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6989138/pexels-photo-6989138.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/9821185/pexels-photo-9821185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/8916713/pexels-photo-8916713.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/8980744/pexels-photo-8980744.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6838250/pexels-photo-6838250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6838175/pexels-photo-6838175.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4510528/pexels-photo-4510528.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4463635/pexels-photo-4463635.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6838176/pexels-photo-6838176.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3025838/pexels-photo-3025838.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/3824893/pexels-photo-3824893.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2980275/pexels-photo-2980275.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7980710/pexels-photo-7980710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/8019064/pexels-photo-8019064.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2891508/pexels-photo-2891508.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2107166/pexels-photo-2107166.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1974498/pexels-photo-1974498.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/2769889/pexels-photo-2769889.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4157896/pexels-photo-4157896.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/11135613/pexels-photo-11135613.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/12504395/pexels-photo-12504395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4110321/pexels-photo-4110321.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/5786066/pexels-photo-5786066.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/11156300/pexels-photo-11156300.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4281861/pexels-photo-4281861.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/5540484/pexels-photo-5540484.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6108510/pexels-photo-6108510.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/9342700/pexels-photo-9342700.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4442772/pexels-photo-4442772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/10868753/pexels-photo-10868753.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/8371516/pexels-photo-8371516.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/11409867/pexels-photo-11409867.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7656529/pexels-photo-7656529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7159351/pexels-photo-7159351.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/10546564/pexels-photo-10546564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/6810225/pexels-photo-6810225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/10988207/pexels-photo-10988207.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4718881/pexels-photo-4718881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/4192767/pexels-photo-4192767.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/7672063/pexels-photo-7672063.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1691046/pexels-photo-1691046.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
        { url: "https://images.pexels.com/photos/1746385/pexels-photo-1746385.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" }
    ]);
    const produits6 = await Product.bulkCreate([
        { name: "Tondeuse électrique", price: 150, description: "Tondeuse écologique", isFavorite: 0, stock: 30, EnterpriseId: newEnterprises[0].id },
        { name: "Panneaux solaires 300W", price: 500, description: "Panneau solaire de haute efficacité", isFavorite: 1, stock: 20, EnterpriseId: newEnterprises[0].id },
        { name: "Batterie lithium 10kWh", price: 1200, description: "Batterie de stockage pour énergie solaire", isFavorite: 0, stock: 10, EnterpriseId: newEnterprises[0].id }
    ]);
    const produits7 = await Product.bulkCreate([
        { name: "Kit de premiers secours", price: 30, description: "Kit complet pour soins d'urgence", isFavorite: 0, stock: 200, EnterpriseId: newEnterprises[1].id },
        { name: "Stéthoscope digital", price: 150, description: "Stéthoscope haute technologie", isFavorite: 1, stock: 50, EnterpriseId: newEnterprises[1].id },
        { name: "Défibrillateur automatique", price: 1200, description: "Dispositif de sauvetage en urgence", isFavorite: 1, stock: 15, EnterpriseId: newEnterprises[1].id }
    ]);
    const produits8 = await Product.bulkCreate([
        { name: "Tablette éducative", price: 250, description: "Outil interactif pour apprentissage", isFavorite: 1, stock: 100, EnterpriseId: newEnterprises[2].id },
        { name: "Logiciel de gestion de classe", price: 500, description: "Plateforme de gestion scolaire", isFavorite: 0, stock: 25, EnterpriseId: newEnterprises[2].id },
        { name: "TBI interactif", price: 1500, description: "Tableau blanc interactif", isFavorite: 1, stock: 10, EnterpriseId: newEnterprises[2].id }
    ]);
    const produits9 = await Product.bulkCreate([
        { name: "Assurance habitation", price: 300, description: "Contrat d'assurance pour logement", isFavorite: 1, stock: 200, EnterpriseId: newEnterprises[3].id },
        { name: "Assurance auto", price: 450, description: "Contrat d'assurance pour véhicule", isFavorite: 1, stock: 100, EnterpriseId: newEnterprises[3].id },
        { name: "Mutuelle santé", price: 600, description: "Assurance santé complète", isFavorite: 1, stock: 80, EnterpriseId: newEnterprises[3].id }
    ]);
    const produits10 = await Product.bulkCreate([
        { name: "Grue de chantier", price: 120000, description: "Grue de levage pour BTP", isFavorite: 1, stock: 5, EnterpriseId: newEnterprises[4].id },
        { name: "Bétonnière électrique", price: 900, description: "Bétonnière de chantier", isFavorite: 0, stock: 30, EnterpriseId: newEnterprises[4].id },
        { name: "Échafaudage métallique", price: 1500, description: "Structure de chantier", isFavorite: 1, stock: 50, EnterpriseId: newEnterprises[4].id }
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
    const associations = await productImage.bulkCreate([
        { ProductId: 1, ImageId: 129 },
        { ProductId: 1, ImageId: 12 },
        { ProductId: 1, ImageId: 291 },
        { ProductId: 1, ImageId: 122 },
        { ProductId: 1, ImageId: 200 },
        { ProductId: 2, ImageId: 45 },
        { ProductId: 2, ImageId: 137 },
        { ProductId: 2, ImageId: 23 },
        { ProductId: 2, ImageId: 68 },
        { ProductId: 2, ImageId: 156 },
        { ProductId: 3, ImageId: 142 },
        { ProductId: 3, ImageId: 88 },
        { ProductId: 3, ImageId: 75 },
        { ProductId: 3, ImageId: 212 },
        { ProductId: 4, ImageId: 63 },
        { ProductId: 4, ImageId: 129 },
        { ProductId: 4, ImageId: 250 },
        { ProductId: 4, ImageId: 185 },
        { ProductId: 4, ImageId: 101 },
        { ProductId: 5, ImageId: 77 },
        { ProductId: 5, ImageId: 34 },
        { ProductId: 5, ImageId: 112 },
        { ProductId: 5, ImageId: 278 },
        { ProductId: 6, ImageId: 215 },
        { ProductId: 6, ImageId: 54 },
        { ProductId: 6, ImageId: 96 },
        { ProductId: 6, ImageId: 234 },
        { ProductId: 7, ImageId: 87 },
        { ProductId: 7, ImageId: 147 },
        { ProductId: 7, ImageId: 190 },
        { ProductId: 8, ImageId: 19 },
        { ProductId: 8, ImageId: 270 },
        { ProductId: 8, ImageId: 92 },
        { ProductId: 8, ImageId: 174 },
        { ProductId: 9, ImageId: 24 },
        { ProductId: 9, ImageId: 231 },
        { ProductId: 9, ImageId: 111 },
        { ProductId: 10, ImageId: 135 },
        { ProductId: 10, ImageId: 172 },
        { ProductId: 10, ImageId: 193 },
        { ProductId: 10, ImageId: 88 },
        { ProductId: 11, ImageId: 190 },
        { ProductId: 11, ImageId: 120 },
        { ProductId: 11, ImageId: 56 },
        { ProductId: 12, ImageId: 36 },
        { ProductId: 12, ImageId: 265 },
        { ProductId: 12, ImageId: 182 },
        { ProductId: 13, ImageId: 210 },
        { ProductId: 13, ImageId: 73 },
        { ProductId: 13, ImageId: 178 },
        { ProductId: 13, ImageId: 59 },
        { ProductId: 14, ImageId: 82 },
        { ProductId: 14, ImageId: 130 },
        { ProductId: 14, ImageId: 225 },
        { ProductId: 15, ImageId: 42 },
        { ProductId: 15, ImageId: 66 },
        { ProductId: 15, ImageId: 289 },
        { ProductId: 15, ImageId: 198 },
        { ProductId: 16, ImageId: 53 },
        { ProductId: 16, ImageId: 157 },
        { ProductId: 16, ImageId: 76 },
        { ProductId: 17, ImageId: 44 },
        { ProductId: 17, ImageId: 19 },
        { ProductId: 17, ImageId: 275 },
        { ProductId: 18, ImageId: 78 },
        { ProductId: 18, ImageId: 69 },
        { ProductId: 18, ImageId: 24 },
        { ProductId: 19, ImageId: 31 },
        { ProductId: 19, ImageId: 230 },
        { ProductId: 19, ImageId: 145 },
        { ProductId: 20, ImageId: 62 },
        { ProductId: 20, ImageId: 129 },
        { ProductId: 20, ImageId: 238 },
        { ProductId: 20, ImageId: 186 },
        { ProductId: 21, ImageId: 80 },
        { ProductId: 21, ImageId: 145 },
        { ProductId: 21, ImageId: 200 },
        { ProductId: 22, ImageId: 10 },
        { ProductId: 22, ImageId: 223 },
        { ProductId: 22, ImageId: 175 },
        { ProductId: 23, ImageId: 55 },
        { ProductId: 23, ImageId: 99 },
        { ProductId: 23, ImageId: 213 },
        { ProductId: 24, ImageId: 141 },
        { ProductId: 24, ImageId: 92 },
        { ProductId: 24, ImageId: 76 },
        { ProductId: 25, ImageId: 131 },
        { ProductId: 25, ImageId: 118 },
        { ProductId: 25, ImageId: 72 },
        { ProductId: 26, ImageId: 183 },
        { ProductId: 26, ImageId: 39 },
        { ProductId: 26, ImageId: 90 },
        { ProductId: 27, ImageId: 225 },
        { ProductId: 27, ImageId: 30 },
        { ProductId: 27, ImageId: 195 },
        { ProductId: 28, ImageId: 44 },
        { ProductId: 28, ImageId: 215 },
        { ProductId: 28, ImageId: 112 },
        { ProductId: 29, ImageId: 102 },
        { ProductId: 29, ImageId: 160 },
        { ProductId: 29, ImageId: 53 },
        { ProductId: 30, ImageId: 25 },
        { ProductId: 30, ImageId: 195 },
        { ProductId: 30, ImageId: 168 },
        { ProductId: 31, ImageId: 29 },
        { ProductId: 31, ImageId: 240 },
        { ProductId: 31, ImageId: 173 },
        { ProductId: 32, ImageId: 85 },
        { ProductId: 32, ImageId: 126 },
        { ProductId: 32, ImageId: 42 },
        { ProductId: 32, ImageId: 215 },
        { ProductId: 32, ImageId: 182 },
        { ProductId: 33, ImageId: 56 },
        { ProductId: 33, ImageId: 98 },
        { ProductId: 33, ImageId: 203 },
        { ProductId: 33, ImageId: 157 },
        { ProductId: 34, ImageId: 73 },
        { ProductId: 34, ImageId: 244 },
        { ProductId: 34, ImageId: 126 },
        { ProductId: 34, ImageId: 159 },
        { ProductId: 34, ImageId: 22 },
        { ProductId: 35, ImageId: 115 },
        { ProductId: 35, ImageId: 48 },
        { ProductId: 35, ImageId: 131 },
        { ProductId: 35, ImageId: 238 },
        { ProductId: 36, ImageId: 27 },
        { ProductId: 36, ImageId: 197 },
        { ProductId: 36, ImageId: 64 },
        { ProductId: 36, ImageId: 190 },
        { ProductId: 37, ImageId: 16 },
        { ProductId: 37, ImageId: 100 },
        { ProductId: 37, ImageId: 174 },
        { ProductId: 37, ImageId: 231 },
        { ProductId: 37, ImageId: 83 },
        { ProductId: 38, ImageId: 66 },
        { ProductId: 38, ImageId: 121 },
        { ProductId: 38, ImageId: 254 },
        { ProductId: 39, ImageId: 45 },
        { ProductId: 39, ImageId: 170 },
        { ProductId: 39, ImageId: 66 },
        { ProductId: 39, ImageId: 200 },
        { ProductId: 39, ImageId: 172 },
        { ProductId: 40, ImageId: 111 },
        { ProductId: 40, ImageId: 29 },
        { ProductId: 40, ImageId: 145 },
        { ProductId: 40, ImageId: 198 },
        { ProductId: 41, ImageId: 51 },
        { ProductId: 41, ImageId: 200 },
        { ProductId: 41, ImageId: 89 },
        { ProductId: 41, ImageId: 155 },
        { ProductId: 42, ImageId: 127 },
        { ProductId: 42, ImageId: 90 },
        { ProductId: 42, ImageId: 33 },
        { ProductId: 43, ImageId: 72 },
        { ProductId: 43, ImageId: 148 },
        { ProductId: 43, ImageId: 277 },
        { ProductId: 43, ImageId: 87 },
        { ProductId: 44, ImageId: 194 },
        { ProductId: 44, ImageId: 234 },
        { ProductId: 44, ImageId: 112 },
        { ProductId: 45, ImageId: 115 },
        { ProductId: 45, ImageId: 150 },
        { ProductId: 45, ImageId: 199 },
        { ProductId: 46, ImageId: 134 },
        { ProductId: 46, ImageId: 20 },
        { ProductId: 46, ImageId: 211 },
        { ProductId: 47, ImageId: 112 },
        { ProductId: 47, ImageId: 98 },
        { ProductId: 47, ImageId: 204 },
        { ProductId: 48, ImageId: 185 },
        { ProductId: 48, ImageId: 177 },
        { ProductId: 48, ImageId: 91 },
        { ProductId: 49, ImageId: 126 },
        { ProductId: 49, ImageId: 65 },
        { ProductId: 49, ImageId: 212 },
        { ProductId: 49, ImageId: 49 },
        { ProductId: 50, ImageId: 69 },
        { ProductId: 50, ImageId: 230 },
        { ProductId: 50, ImageId: 93 },
        { ProductId: 51, ImageId: 55 },
        { ProductId: 51, ImageId: 104 },
        { ProductId: 51, ImageId: 260 },
        { ProductId: 52, ImageId: 13 },
        { ProductId: 52, ImageId: 162 },
        { ProductId: 52, ImageId: 215 },
        { ProductId: 53, ImageId: 46 },
        { ProductId: 53, ImageId: 181 },
        { ProductId: 53, ImageId: 82 },
        { ProductId: 54, ImageId: 142 },
        { ProductId: 54, ImageId: 18 },
        { ProductId: 54, ImageId: 229 },
        { ProductId: 55, ImageId: 44 },
        { ProductId: 55, ImageId: 78 },
        { ProductId: 55, ImageId: 203 },
        { ProductId: 56, ImageId: 187 },
        { ProductId: 56, ImageId: 156 },
        { ProductId: 56, ImageId: 19 },
        { ProductId: 57, ImageId: 135 },
        { ProductId: 57, ImageId: 197 },
        { ProductId: 57, ImageId: 22 },
        { ProductId: 58, ImageId: 120 },
        { ProductId: 58, ImageId: 66 },
        { ProductId: 58, ImageId: 255 },
        { ProductId: 59, ImageId: 52 },
        { ProductId: 59, ImageId: 117 },
        { ProductId: 59, ImageId: 278 },
        { ProductId: 60, ImageId: 21 },
        { ProductId: 60, ImageId: 119 },
        { ProductId: 60, ImageId: 77 },
        { ProductId: 61, ImageId: 11 },
        { ProductId: 61, ImageId: 101 },
        { ProductId: 61, ImageId: 196 },
        { ProductId: 62, ImageId: 176 },
        { ProductId: 62, ImageId: 50 },
        { ProductId: 62, ImageId: 138 },
        { ProductId: 63, ImageId: 86 },
        { ProductId: 63, ImageId: 164 },
        { ProductId: 63, ImageId: 95 },
        { ProductId: 64, ImageId: 233 },
        { ProductId: 64, ImageId: 45 },
        { ProductId: 64, ImageId: 99 },
        { ProductId: 65, ImageId: 25 },
        { ProductId: 65, ImageId: 177 },
        { ProductId: 65, ImageId: 287 }
    ]);
    // Lien produits et entreprises avec les catégories
    await categoriesProduits[0].addProducts(produits1); // Automobile
    await categoriesProduits[1].addProducts(produits2); // Informatique
    await categoriesProduits[2].addProducts(produits3); // Télécommunications
    await categoriesProduits[1].addProducts(produits4); // Informatique
    await categoriesProduits[3].addProducts(produits5); // Audiovisuel
    await categoriesProduits[3].addProducts(produits6); // Énergies Vertes
    await categoriesProduits[4].addProducts(produits7); // Santé
    await categoriesProduits[5].addProducts(produits8); // Éducation
    await categoriesProduits[6].addProducts(produits9); // Finance et Assurance
    await categoriesProduits[9].addProducts(produits10); // Bâtiment et Travaux Publics
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
});
