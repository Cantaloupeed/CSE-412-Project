const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());
app.use(express.static('frontend'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/main.html');
});

// Database connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'GroupProject',
  password: 'AZBucksIn621',
  port: 5432,
});

// API route for Read functionality
app.get('/menu', async (req, res) => {
  const { hall, meal } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT 
        f.Item_id,
        f.Item_Name,
        f.Item_Calories,
        f.Item_Protein,
        STRING_AGG(i.Ingredient_Name, ', ') AS ingredients
      FROM Dininghall d
      JOIN Menu m ON d.Dininghall_id = m.Dininghall_id
      JOIN Fooditems f ON m.Menu_id = f.Menu_id
      LEFT JOIN Ingredients i ON f.Item_id = i.Item_id
      WHERE LOWER(d.Dininghall_Name) = LOWER($1)
        AND m.Menu_Type = $2
      GROUP BY f.Item_id, f.Item_Name, f.Item_Calories, f.Item_Protein
      `,
      [hall, meal]
    );

    const formatted = result.rows.map(row => ({
      id: row.item_id,
      name: row.item_name,
      ingredients: row.ingredients || "N/A",
      calories: row.item_calories,
      protein: row.item_protein
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// API route for Insert functionality
app.post('/menu', async (req, res) => {
  const { hall, meal, name, calories, protein, ingredients } = req.body;
  // Start by querying for the Menu_id
  try {
    const menuResult = await pool.query(
      `SELECT m.Menu_id
       FROM Menu m
       JOIN Dininghall d ON m.Dininghall_id = d.Dininghall_id
       WHERE d.Dininghall_Name = $1
       AND m.Menu_Type = $2`,
      [hall, meal]
    );

    const menuId = menuResult.rows[0].menu_id;

    // Create the new item_id based on the current max item_id
    const idResult = await pool.query(
      `SELECT COALESCE(MAX(Item_id), 0) AS max FROM Fooditems`
    );
    const newItemId = idResult.rows[0].max + 1;

    // Insert item item the FoodItems table
    await pool.query(
      `INSERT INTO Fooditems (Item_id, Item_Name, Item_Calories, Item_Protein, Menu_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [newItemId, name, calories, protein, menuId]
    );

    // Insert all of the ingredients of that item into the Ingredients table
     if (ingredients) {
      const list = ingredients.split(',').map(i => i.trim());

      let ingResult = await pool.query(
        `SELECT COALESCE(MAX(Ingredient_id), 0) AS max FROM Ingredients`
      );

      let nextIngId = ingResult.rows[0].max + 1;

      for (let ing of list) {
        await pool.query(
          `INSERT INTO Ingredients (Ingredient_id, Item_id, Ingredient_Name)
           VALUES ($1, $2, $3)`,
          [nextIngId, newItemId, ing]
        );
        nextIngId++;
      }
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).send("Insert failed");
  }

});

// API route for Delete functionality
app.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM Ingredients WHERE Item_id = $1`, [id]);
    await pool.query(`DELETE FROM Fooditems WHERE Item_id = $1`, [id]);
    res.json({ success: true });
  }
  catch (err) {
  console.error(err);
  res.status(500).send("Delete failed");
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});