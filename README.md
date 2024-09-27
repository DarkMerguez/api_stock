```
mermaid
---
title: Diagramme MCDUML
---
erDiagram
    Product {
        id INT
        name TEXT
        price FLOAT
        description TEXT
        isFavorite BOOLEAN
        stock INT
        enterpriseId INT
        productCategoryId INT
    }

    ProductCart {
        id INT
        quantity INT
        productId INT
        cartId INT
    }

    Carac {
        id INT
        name TEXT
        unit TEXT
    }

    CaracProduct {
        id INT
        value INT
        caracId INT
        productId INT
    }

    Cart {
        id INT
        enterpriseId INT
    }

    User {
        id INT
        firstName TEXT
        lastName TEXT
        password TEXT
        email TEXT
        imageId INT
        enterpriseID INT
        roleId INT
    }

    Images {
        id INT
        url TEXT
    }

    ProductImages {
        id INT
        productId INT
        imageId INT
    }

    ProductCategory {
        id INT
        title TEXT
    }

    EnterpriseCategory {
        id INT
        title TEXT
    }

    Enterprise {
        id INT
        name TEXT
        address TEXT
        siret INT
        enterpriseCategoryId INT
        imagesId INT
    }

    Bill {
        id INT
        sellerId INT
        buyerId INT
        orderId INT
    }

    Order {
        id INT
        status INT
        sellerId INT
        buyerId INT
    }

    BillProduct {
        id INT
        billId INT
        productId INT
    }

    OrderProduct {
        id INT
        orderId INT
        productId INT
    }

    Product ||--|{ ProductImages : "includes"
    Images ||--|{ ProductImages : "represents"

    Product ||--|{ CaracProduct : "has"
    Carac ||--|{ CaracProduct : "defines"

    Product ||--|{ ProductCart : "contains"
    Cart ||--|{ ProductCart : "holds"

    Product ||--|{ BillProduct : "bills"
    Bill ||--|{ BillProduct : "details"

    Product }|--|| ProductCategory : "belongs_to"
    Product ||--|{ OrderProduct : "orders"
    Order ||--|{ OrderProduct : "contains"

    User ||--|| Images : "has"

    Order ||--|| Bill : "generates"
    Enterprise }|--|| EnterpriseCategory : "classified_as"

    Enterprise ||--|| Cart : "manages"

    Enterprise ||--|{ Product : "offers"

    Enterprise ||--|| Images : "stores"

    Enterprise ||--|{ User : "employs"

    Enterprise ||--|{ Bill : "generates"

    Enterprise ||--|{ Order : "processes"
```