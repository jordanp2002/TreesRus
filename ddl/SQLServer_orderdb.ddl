CREATE DATABASE orders;
go

USE orders;
go

DROP TABLE review;
DROP TABLE shipment;
DROP TABLE productinventory;
DROP TABLE warehouse;
DROP TABLE orderproduct;
DROP TABLE incart;
DROP TABLE product;
DROP TABLE category;
DROP TABLE ordersummary;
DROP TABLE paymentmethod;
DROP TABLE customer;
DROP TABLE IF EXISTS productreview;



CREATE TABLE customer (
    customerId          INT IDENTITY,
    firstName           VARCHAR(40),
    lastName            VARCHAR(40),
    email               VARCHAR(50),
    phonenum            VARCHAR(20),
    address             VARCHAR(50),
    city                VARCHAR(40),
    state               VARCHAR(20),
    postalCode          VARCHAR(20),
    country             VARCHAR(40),
    userid              VARCHAR(20),
    password            VARCHAR(30),
    PRIMARY KEY (customerId)
);

CREATE TABLE paymentmethod (
    paymentMethodId     INT IDENTITY,
    paymentType         VARCHAR(20),
    paymentNumber       VARCHAR(30),
    paymentExpiryDate   DATE,
    customerId          INT,
    PRIMARY KEY (paymentMethodId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE ordersummary (
    orderId             INT IDENTITY,
    orderDate           DATETIME,
    totalAmount         DECIMAL(10,2),
    shiptoAddress       VARCHAR(50),
    shiptoCity          VARCHAR(40),
    shiptoState         VARCHAR(20),
    shiptoPostalCode    VARCHAR(20),
    shiptoCountry       VARCHAR(40),
    customerId          INT,
    PRIMARY KEY (orderId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE category (
    categoryId          INT IDENTITY,
    categoryName        VARCHAR(50),    
    PRIMARY KEY (categoryId)
);

CREATE TABLE product (
    productId           INT IDENTITY,
    productName         VARCHAR(40),
    productPrice        DECIMAL(10,2),
    productImageURL     VARCHAR(100),
    productImage        VARBINARY(MAX),
    productDesc         VARCHAR(1000),
    categoryId          INT,
    PRIMARY KEY (productId),
    FOREIGN KEY (categoryId) REFERENCES category(categoryId)
);

CREATE TABLE orderproduct (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE incart (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE warehouse (
    warehouseId         INT IDENTITY,
    warehouseName       VARCHAR(30),    
    PRIMARY KEY (warehouseId)
);

CREATE TABLE shipment (
    shipmentId          INT IDENTITY,
    shipmentDate        DATETIME,   
    shipmentDesc        VARCHAR(100),   
    warehouseId         INT, 
    PRIMARY KEY (shipmentId),
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE productinventory ( 
    productId           INT,
    warehouseId         INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (productId, warehouseId),   
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE review (
    reviewId            INT IDENTITY,
    reviewRating        INT,
    reviewDate          DATETIME,   
    customerId          INT,
    productId           INT,
    reviewComment       VARCHAR(1000),          
    PRIMARY KEY (reviewId),
    FOREIGN KEY (customerId) REFERENCES customer(customerId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE CASCADE
);



INSERT INTO category(categoryName) VALUES ('Regular Trees');
INSERT INTO category(categoryName) VALUES ('Evergreen Trees'); 
INSERT INTO category(categoryName) VALUES ('Fruit Trees');
INSERT INTO category(categoryName) VALUES ('Special Trees');



INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Oak', 1, 'Oak Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Maple', 1, 'Maple Tree ' ,270.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Willow', 1, 'Willow Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Ash', 1, 'Ash Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Elm', 1, 'Elm Tree .' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Walnut', 1, 'Walnut Tree ' ,270.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Poplar', 1, 'Poplar Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Dogwood', 1, 'Dogwood Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Birch', 1, 'Birch Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Aspen', 1, 'Aspen Tree ' ,250.00);

INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Spurce', 2, 'Spruce Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Pine', 2, 'Pine Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Fir', 2, 'Fir Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Cedar', 2, 'Cedar Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Redwood', 2, 'Redwood Tree ' ,250.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Hemlock', 2, 'Hemlock Tree ' ,250.00);

INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Apple', 3, 'Apple Tree ' ,300.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Cherry', 3, 'Cherry Tree ' ,350.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Pear', 3, 'Pear Tree ' ,300.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Peach', 3, 'Peach Tree ' ,300.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Plum', 3, 'Plum Tree ' ,300.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Apricot', 3, 'Apricot Tree ' ,300.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Orange', 3, 'Orange Tree ' ,300.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Lemon', 3, 'Lemon Tree ' ,300.00);
INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Banana', 3, 'Banana Tree ' ,350.00);

INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Bonsai', 4, 'Bonsai Tree' ,500.00);



INSERT INTO warehouse(warehouseName) VALUES ('Main warehouse');



INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (1, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (2, 1, 10, 270);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (3, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (4, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (5, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (6, 1, 10, 270);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (7, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (8, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (9, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (10, 1, 10, 250);

INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (11, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (12, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (13, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (14, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (15, 1, 10, 250);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (16, 1, 10, 250);

INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (17, 1, 10, 300);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (18, 1, 10, 350);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (19, 1, 10, 300);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (20, 1, 10, 300);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (21, 1, 10, 300);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (22, 1, 10, 300);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (23, 1, 10, 300);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (24, 1, 10, 300);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (25, 1, 10, 300);

INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (26, 1, 10, 40);



INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Arnold', 'Anderson', 'a.anderson@gmail.com', '204-111-2222', '103 AnyWhere Street', 'Winnipeg', 'MB', 'R3X 45T', 'Canada', 'arnold' , 'test');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Bobby', 'Brown', 'bobby.brown@hotmail.ca', '572-342-8911', '222 Bush Avenue', 'Boston', 'MA', '22222', 'United States', 'bobby' , 'bobby');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Candace', 'Cole', 'cole@charity.org', '333-444-5555', '333 Central Crescent', 'Chicago', 'IL', '33333', 'United States', 'candace' , 'password');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Darren', 'Doe', 'oe@doe.com', '250-807-2222', '444 Dover Lane', 'Kelowna', 'BC', 'V1V 2X9', 'Canada', 'darren' , 'pw');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Elizabeth', 'Elliott', 'engel@uiowa.edu', '555-666-7777', '555 Everwood Street', 'Iowa City', 'IA', '52241', 'United States', 'beth' , 'test');

-- Order 1 can be shipped as have enough inventory
DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (1, '2019-10-15 10:25:55', 770)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 1, 1, 250)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 2, 2, 270)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 3, 1, 250);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-16 18:00:00', 250)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 1, 250);

-- Order 3 cannot be shipped as do not have enough inventory for item 7
DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (3, '2019-10-15 3:30:22', 520)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 2, 2, 270)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 3, 11, 250);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-17 05:45:11', 1270)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 1, 4, 250)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 2, 3, 270)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 8, 3, 250)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 7, 2, 250)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 14, 4, 250);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (5, '2019-10-15 10:25:55', 850)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 4, 4, 250)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 20, 2, 300)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 21, 3, 300);

-- Pictures for trees
UPDATE Product SET productImageURL = 'img/oak.png' WHERE ProductId = 1; 
UPDATE Product SET productImageURL = 'img/maple.png' WHERE ProductId = 2;
UPDATE Product SET productImageURL = 'img/willow.png' WHERE ProductId = 3;
UPDATE Product SET productImageURL = 'img/ash.png' WHERE ProductId = 4;
UPDATE Product SET productImageURL = 'img/elm.png' WHERE ProductId = 5;
UPDATE Product SET productImageURL = 'img/walnut.png' WHERE ProductId = 6;
UPDATE Product SET productImageURL = 'img/poplar.png' WHERE ProductId = 7;
UPDATE Product SET productImageURL = 'img/dogwood.png' WHERE ProductId = 8;
UPDATE Product SET productImageURL = 'img/birch.png' WHERE ProductId = 9;
UPDATE Product SET productImageURL = 'img/aspen.png' WHERE ProductId = 10;

UPDATE Product SET productImageURL = 'img/spruce.png' WHERE ProductId = 11;
UPDATE Product SET productImageURL = 'img/pine.png' WHERE ProductId = 12;
UPDATE Product SET productImageURL = 'img/fir.png' WHERE ProductId = 13;
UPDATE Product SET productImageURL = 'img/cedar.png' WHERE ProductId = 14;
UPDATE Product SET productImageURL = 'img/redwood.jpg' WHERE ProductId = 15;
UPDATE Product SET productImageURL = 'img/hemlock.png' WHERE ProductId = 16;

UPDATE Product SET productImageURL = 'img/apple.png' WHERE ProductId = 17;
UPDATE Product SET productImageURL = 'img/cherry.png' WHERE ProductId = 18;
UPDATE Product SET productImageURL = 'img/pear.png' WHERE ProductId = 19;
UPDATE Product SET productImageURL = 'img/peach.png' WHERE ProductId = 20;
UPDATE Product SET productImageURL = 'img/plum.png' WHERE ProductId = 21;
UPDATE Product SET productImageURL = 'img/apricot.png' WHERE ProductId = 22;
UPDATE Product SET productImageURL = 'img/orange.png' WHERE ProductId = 23;
UPDATE Product SET productImageURL = 'img/lemon.png' WHERE ProductId = 24;
UPDATE Product SET productImageURL = 'img/banana.png' WHERE ProductId = 25;

UPDATE Product SET productImageURL = 'img/bonsai.png' WHERE ProductId = 26;


CREATE TABLE productreview (
    reviewId     INT IDENTITY,
    reviewDesc   VARCHAR(1000),
    productId        INT,
    PRIMARY KEY (reviewId),
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE CASCADE 
);


INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',1);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',2);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',3);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',4);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',5);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',6);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',7);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',8);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',9);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',10);

INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',11);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',12);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',13);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',14);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',15);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',16);

INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',17);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',18);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',19);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',20);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',21);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',22);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',23);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',24);
INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',25);

INSERT INTO productreview(reviewDesc,productId) VALUES ('Very good tree',26);