import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from backend API
        axios.get("http://localhost:3000/api/products") // Ensure the correct endpoint
            .then((res) => {
                console.log(res.data); // Log the response to check the structure
                setProducts(res.data); // Set the fetched data to state
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setError("Failed to load product data."); // Set error message if fetching fails
            });
    }, []);

    return (
        <div>
            <h2>Products</h2>
            {error ? (
                <div style={{ color: "red" }}>{error}</div> // Display error if present
            ) : (
                <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.length > 0 ? (
                        products.map((prod) => (
                            <tr key={prod.Product_ID}>
                                <td>{prod.Product_ID}</td>
                                <td>{prod.Product_Name}</td>
                                <td>{prod.Category_Name}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                                No products available
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductTable;
