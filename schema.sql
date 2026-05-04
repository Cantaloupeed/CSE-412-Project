CREATE TABLE Campus (
Campus_id INT PRIMARY KEY,
Campus_Name VARCHAR(255) NOT NULL UNIQUE,
Campus_City VARCHAR(255) NOT NULL,
Campus_Zip VARCHAR(20) NOT NULL
);

CREATE TABLE Dininghall (
Dininghall_id INT PRIMARY KEY,
Dininghall_Name VARCHAR(255) NOT NULL UNIQUE,
Dininghall_Address VARCHAR(255) NOT NULL,
Dininghall_Open TIME NOT NULL,
Dininghall_Close TIME NOT NULL,
Campus_id INT NOT NULL,
FOREIGN KEY (Campus_id) REFERENCES Campus(Campus_id),
CHECK (Dininghall_Open < Dininghall_Close)
);

CREATE TABLE Menu (
Menu_id INT PRIMARY KEY,
Menu_EntranceCost DECIMAL(5,2) NOT NULL,
Menu_Type VARCHAR(100) NOT NULL,
Dininghall_id INT NOT NULL,
FOREIGN KEY (Dininghall_id) REFERENCES Dininghall(Dininghall_id)
);

CREATE TABLE Fooditems (
Item_id INT PRIMARY KEY,
Item_Name VARCHAR(255) NOT NULL,
Item_Calories INT NOT NULL,
Item_Protein INT NOT NULL,
Menu_id INT NOT NULL,
FOREIGN KEY (Menu_id) REFERENCES Menu(Menu_id)
);

CREATE TABLE Ingredients (
Ingredient_id INT PRIMARY KEY,
Item_id INT NOT NULL,
Ingredient_Name VARCHAR(255) NOT NULL,
FOREIGN KEY (Item_id) REFERENCES FoodItems(Item_id)
);
