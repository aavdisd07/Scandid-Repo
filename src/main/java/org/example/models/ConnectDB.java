package org.example.models;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectDB {

    private Connection connection;

    public ConnectDB() {
        String url = "jdbc:sqlite:database.db"; // Specify your database URL

        try {
            connection = DriverManager.getConnection(url);
            System.out.println("Connection Successful");
        } catch (SQLException e) {
            System.out.println("Error Connecting to Database: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public Connection getConnection() {
        return connection;
    }

    public void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                System.out.println("Connection Closed");
            } catch (SQLException e) {
                System.out.println("Error Closing Database Connection: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
