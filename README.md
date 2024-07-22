```mermaid
---
title : Diagramme MCDUML
---
erDiagram
    Product{
        id INT
        name TEXT
        price FLOAT
        description TEXT
        isFavorite BOOLEAN
        stock INT
        enterpriseId INT
    }
        ProductCart["ProductCart(join)"]{
        id INT
        quantity INT
        productId INT
        cartId INT
    }
    Carac{
        id INT
        name TEXT
        unit TEXT
    }
    CaracProduct["CaracProduct(join)"]{
        id INT
        value TEXT
        caracId INT
        productId INT
    }
    Cart{
        id INT
        userId INT
    }
    User{
        id INT
        firstName TEXT
        lastName TEXT
        password TEXT
        email TEXT
        userImage INT
        enterpriseID INT
        roleId INT
    }
    Images{
        id INT
        url TEXT
    }
    ProductImages["ProductImages(join)"]{
        id INT
        productId INT
        imageId INT
}
    Role{
        id INT
        name TEXT
        importance INT
    }
    ProductCategory{
        id INT
        title TEXT
    }
    EnterpriseCategory{
        id INT
        title TEXT
    }
    Enterprise{
        id INT
        name TEXT
        address TEXT
        enterpriseCategoryId INT
        imagesId INT
    }
    Bill{
        id INT
        enterprise1Id INT
        enterprise2Id INT
        orderId INT
    }
    Order{
        id INT
        status INT
    }
    EnterpriseOrder["EnterpriseOrder(join)"]{
        id INT
        enterpriseId INT
        orderId INT
    }
    EnterpriseBill["EnterpriseBill(join)"]{
        id INT
        enterpriseId INT
        billId INT
    }
    BillProduct["BillProduct(join)"]{
        id INT
        billId INT
        productId INT
    }
    OrderProduct["OrderProduct(join)"]{
        id INT
        orderId INT
        productId INT
    }
  

    
    Product ||--|{ ProductImages : has
    Images ||--|{ ProductImages : has
    
    Product ||--|{ CaracProduct : has
    Carac ||--|{ CaracProduct : has
    
    Product ||--|{ ProductCart : has
    Cart ||--|{ ProductCart : has

    Product ||--|{ BillProduct : has
    Bill ||--|{ BillProduct : has

    Product }|--|| ProductCategory : has
    Product ||--|{ OrderProduct : has
    Order ||--|{ OrderProduct : has


    User ||--|| Images : has

    User }|--|| Role : has

    Order ||--|| Bill : has
    Enterprise }|--|| EnterpriseCategory : has

    Enterprise ||--|| Cart : has

    Enterprise ||--|{ Product : has

    Enterprise ||--|| Images : has

    Enterprise ||--|{ User : has

    Enterprise ||--|{ EnterpriseBill : has
    Bill ||--|{ EnterpriseBill : has

    Enterprise ||--|{ EnterpriseOrder : has
    Order ||--|{ EnterpriseOrder : has
```
