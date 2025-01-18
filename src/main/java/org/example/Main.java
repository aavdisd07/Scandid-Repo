package org.example;

import org.example.models.ConnectDB;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.*;

public class Main {

    public static void main(String[] args) {
        ConnectDB db = new ConnectDB();
        Connection connection = db.getConnection();

        if (connection != null) {
            try {
                connection.setAutoCommit(false); // Start transaction

                Statement statement = connection.createStatement();

                // Create Tables
                String createCategoryTable = "CREATE TABLE IF NOT EXISTS Category ( " +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                        "name VARCHAR(255) NOT NULL UNIQUE );";

                String createProductTable = "CREATE TABLE IF NOT EXISTS Product ( " +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                        "name VARCHAR(255) NOT NULL UNIQUE, " +
                        "category_id INTEGER, " +
                        "price REAL, " +
                        "FOREIGN KEY (category_id) REFERENCES Category(id) );";

                String createTransactionTable = "CREATE TABLE IF NOT EXISTS Transactions ( " +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                        "product_id INTEGER, " +
                        "quantity INTEGER, " +
                        "transaction_date DATE, " +
                        "FOREIGN KEY (product_id) REFERENCES Product(id) );";

                statement.executeUpdate(createCategoryTable);
                statement.executeUpdate(createProductTable);
                statement.executeUpdate(createTransactionTable);

                // Prepare Statements
                String insertCategory = "INSERT OR IGNORE INTO Category (name) VALUES (?)";
                PreparedStatement categoryStmt = connection.prepareStatement(insertCategory);

                String insertProduct = "INSERT OR IGNORE INTO Product (name, category_id, price) " +
                        "VALUES (?, (SELECT id FROM Category WHERE name = ?), ?)";
                PreparedStatement productStmt = connection.prepareStatement(insertProduct);

                String insertTransaction = "INSERT INTO Transactions (product_id, quantity, transaction_date) " +
                        "VALUES ((SELECT id FROM Product WHERE name = ?), ?, ?)";
                PreparedStatement transactionStmt = connection.prepareStatement(insertTransaction);

                // Load CSV file
                String csvFile = "C:\\Users\\Rohit Deshmukh\\IdeaProjects\\Task1\\Transactions.csv";
                BufferedReader br = new BufferedReader(new FileReader(csvFile));
                String line;
                br.readLine(); // Skip header row

                while ((line = br.readLine()) != null) {
                    String[] data = line.split(",");
                    if (data.length < 4) continue; // Skip invalid rows

                    String transactionDate = data[0].trim();
                    String productName = data[1].trim();
                    String category = data[2].trim();
                    int quantity = Integer.parseInt(data[3].trim());

                    // Insert Category (if it doesn't exist)
                    categoryStmt.setString(1, category);
                    categoryStmt.executeUpdate();

                    // Insert Product (if it doesn't exist)
                    // Assuming price is given in the CSV or use a placeholder if not
                    double price = 0.0; // Placeholder price

                    if (data.length > 4) {
                        try {
                            price = Double.parseDouble(data[4].trim()); // Parse price if available in CSV
                        } catch (NumberFormatException e) {
                            price = 0.0; // Default to 0 if price is invalid
                        }
                    }

                    productStmt.setString(1, productName);
                    productStmt.setString(2, category);
                    productStmt.setDouble(3, price);
                    productStmt.executeUpdate();

                    // Insert Transaction
                    transactionStmt.setString(1, productName);
                    transactionStmt.setInt(2, quantity);
                    transactionStmt.setDate(3, Date.valueOf(transactionDate));
                    transactionStmt.executeUpdate();
                }

                // Commit transaction
                connection.commit();

                System.out.println("Data imported successfully!");

                // Close resources
                br.close();
                categoryStmt.close();
                productStmt.close();
                transactionStmt.close();
            } catch (SQLException | IOException e) {
                try {
                    connection.rollback();
                } catch (SQLException rollbackEx) {
                    rollbackEx.printStackTrace();
                }
                e.printStackTrace();
            } finally {
                try {
                    connection.setAutoCommit(true);
                    connection.close(); // Close the connection
                } catch (SQLException closeEx) {
                    closeEx.printStackTrace();
                }
            }
        } else {
            System.out.println("Connection failed.");
        }
    }
}
