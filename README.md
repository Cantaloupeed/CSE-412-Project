# CSE-412 Project: ASU Dining Decision Platform

A centralized dining information platform designed to help Arizona State University students make more informed meal decisions across ASU campuses. The project combines dining hall, menu, pricing, nutrition, and ingredient data into a searchable web application backed by a PostgreSQL database.

## Project Overview

ASU students often need to check multiple sources to understand what dining halls are available, what food is being served, how much meals cost, and whether menu items match their dietary or nutritional preferences. This project addresses that problem by organizing ASU dining information into one user-friendly system.

The goal is to allow students to:

- Filter dining halls by campus, dining hall, meal period, cost, and preferences.
- Search menus and explore available food options.
- Compare pricing and nutritional information.
- View ingredients, calories, and protein for menu items.
- Access updated menu information sourced from the official ASU Dining website.

The current implementation is a working prototype focused on dining hall menu browsing and basic menu-item management.

## Current Features

- Dining hall menu viewer for ASU dining locations.
- Meal filtering for Breakfast, Lunch, and Dinner.
- Dining hall selector for Barrett, Hassayampa, Tooker, Manzanita, HIDA, and Pitchforks.
- Menu cards showing item name, ingredients, calories, and protein.
- PostgreSQL database schema for campuses, dining halls, menus, food items, and ingredients.
- Seed CSV files for loading dining data into the database.
- Express API for reading, inserting, and deleting menu items.
- Static frontend served directly from the Node/Express backend.
- Admin-style form for adding new menu items to a selected dining hall and meal.

## Problem Statement

ASU Dining provides valuable food and nutrition information, but students may still struggle with clarity around dining hall availability, food options, pricing, and nutritional details. This project creates a structured database and web interface that make that information easier to search, filter, and compare.

The platform is especially useful for students who want to:

- Decide where to eat before walking across campus.
- Check whether a dining hall has food that fits their preferences.
- Compare calorie and protein information across menu items.
- Understand meal pricing before visiting a dining location.
- Browse ingredients for dietary awareness.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: PostgreSQL
- Data Files: CSV seed files

## Repository Structure

```text
CSE-412-Project/
+-- backend.js
+-- frontend/
|   +-- main.html
+-- schema.sql
+-- CSV FIles for DB/
|   +-- CampusSchema.csv
|   +-- DininghallSchema.csv
|   +-- MenuSchema.csv
|   +-- FooditemsSchema.csv
|   +-- IngredientsSchema.csv
+-- package.json
+-- package-lock.json
+-- README.md
```

## Database Design

The database is organized around five main entities:

### Campus

Stores ASU campus information.

- `Campus_id`
- `Campus_Name`
- `Campus_City`
- `Campus_Zip`

### Dininghall

Stores dining hall details and connects each dining hall to a campus.

- `Dininghall_id`
- `Dininghall_Name`
- `Dininghall_Address`
- `Dininghall_Open`
- `Dininghall_Close`
- `Campus_id`

### Menu

Stores meal-period menus for each dining hall, including entrance cost.

- `Menu_id`
- `Menu_EntranceCost`
- `Menu_Type`
- `Dininghall_id`

### Fooditems

Stores individual menu items and their nutrition information.

- `Item_id`
- `Item_Name`
- `Item_Calories`
- `Item_Protein`
- `Menu_id`

### Ingredients

Stores ingredients associated with each food item.

- `Ingredient_id`
- `Item_id`
- `Ingredient_Name`

## Setup Instructions

### 1. Install Dependencies

Make sure Node.js and PostgreSQL are installed, then run:

```bash
npm install
```

The project depends on:

```bash
npm install express pg
```

### 2. Create the PostgreSQL Database

The backend currently expects a PostgreSQL database named `GroupProject`.

```sql
CREATE DATABASE "GroupProject";
```

Then connect to the database and run the schema:

```bash
psql -U postgres -d GroupProject -f schema.sql
```

### 3. Load the CSV Data

Load the CSV files in this order so foreign key references are available:

1. `CampusSchema.csv`
2. `DininghallSchema.csv`
3. `MenuSchema.csv`
4. `FooditemsSchema.csv`
5. `IngredientsSchema.csv`

Example using `psql` from the project root:

```sql
\copy Campus FROM 'CSV FIles for DB/CampusSchema.csv' WITH (FORMAT csv, HEADER true);
\copy Dininghall FROM 'CSV FIles for DB/DininghallSchema.csv' WITH (FORMAT csv, HEADER true);
\copy Menu FROM 'CSV FIles for DB/MenuSchema.csv' WITH (FORMAT csv, HEADER true);
\copy Fooditems FROM 'CSV FIles for DB/FooditemsSchema.csv' WITH (FORMAT csv, HEADER true);
\copy Ingredients FROM 'CSV FIles for DB/IngredientsSchema.csv' WITH (FORMAT csv, HEADER true);
```

Alternatively:

Open up the schemas dropdown, then the tables dropdown, and right-click the campus table and select  ‘Import/Export Data’.

In the ‘Options’ tab, select the setting to set ‘Header’ to true, and set the delimiter to ‘,’. Once this is done, return to the General tab and in the ‘Filename' entry, enter the filepath for the CampusSchema.csv file. Finally, click ‘OK’.

Repeat the last step for the rest of the tables in the order of DiningHall -> Menu -> FoodItems -> Ingredients. Use their respective CSV files (DininghallSchema, MenuSchema, FoodItemsSchema, and IngredientsSchema).


### 4. Configure the Database Connection

The database connection is defined in `backend.js`:

```js
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'GroupProject',
  password: 'password',
  port: 5432,
});
```

Update the username, password, database name, or port if your local PostgreSQL configuration is different.

### 5. Run the Application

Start the backend server:

```bash
node backend.js
```

Then open:

```text
http://localhost:3000
```
