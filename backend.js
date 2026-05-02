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
  database: 'insert your database name here',
  password: 'insert your password here',
  port: 5432,
});

// API route
app.get('/menu', async (req, res) => {
  const { hall, meal } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT 
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
      GROUP BY f.Item_id
      `,
      [hall, meal]
    );

    // Format to match frontend
    const formatted = result.rows.map(row => ({
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

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});