const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import the cors package
const path = require('path'); // To handle relative paths for database
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS to allow cross-origin requests from frontend
app.use(cors());
const dbPath = path.resolve('C:/Users/Rohit Deshmukh/IdeaProjects/Task1/database.db');

// Connect to SQLite database (Use relative path or environment variables for portability)
// const dbPath = path.join(__dirname, 'C:\\Users\\Rohit Deshmukh\\IdeaProjects\\Task1\\database.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Enable foreign key support
        db.run("PRAGMA foreign_keys = ON;");
    }
});

// API to fetch transaction data
app.get('/api/transaction', (req, res) => {
    const query = `
        SELECT
            t.transaction_date,
            p.name AS product_name,
            c.name AS category,
            t.quantity
        FROM
            Transactions t
                INNER JOIN
            Product p ON t.product_id = p.id
                INNER JOIN
            Category c ON p.category_id = c.id
        ORDER BY
            t.transaction_date;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('SQL error:', err.message);
            return res.status(500).json({ error: 'Failed to fetch data from database' });
        }

        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No transaction data found' });
        }

        // Transform and send the result in the desired format
        const transformedData = rows.map(row => ({
            transaction_date: new Date(row.transaction_date).toLocaleDateString(),
            product_name: row.product_name,
            category: row.category,
            quantity: row.quantity
        }));

        res.json(transformedData);
    });
});

// API to fetch categories data
app.get('/api/categories', (req, res) => {
    const query = `
        SELECT id AS Category_ID, name AS Category_Name FROM Category ORDER BY name;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('SQL error:', err.message);
            return res.status(500).json({ error: 'Failed to fetch data from database' });
        }

        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        // Send the response to the frontend
        res.json(rows);
    });
});

// API to fetch products data
app.get('/api/products', (req, res) => {
    const query = `
        SELECT
            p.id AS Product_ID,
            p.name AS Product_Name,
            c.name AS Category_Name,
            p.price AS Price
        FROM
            Product p
                INNER JOIN
            Category c ON p.category_id = c.id
        ORDER BY
            p.name;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('SQL error:', err.message);
            return res.status(500).json({ error: 'Failed to fetch data from database' });
        }

        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        // Transform and send the result in the desired format
        const transformedData = rows.map(row => ({
            Product_ID: row.Product_ID,
            Product_Name: row.Product_Name,
            Category_Name: row.Category_Name,
            Price: row.Price
        }));

        res.json(transformedData);
    });
});

// Gracefully handle shutdown and close the database connection
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        }
        console.log('Database connection closed.');
    });
    process.exit();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
