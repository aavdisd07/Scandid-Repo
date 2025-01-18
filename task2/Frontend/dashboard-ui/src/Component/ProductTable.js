import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        productName: "",
        category: ""
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilter({
            ...filter,
            [name]: value
        });
    };

    const filteredProducts = products.filter((prod) => {
        return (
            prod.Product_Name.toLowerCase().includes(filter.productName.toLowerCase()) &&
            prod.Category_Name.toLowerCase().includes(filter.category.toLowerCase())
        );
    });

    return (
        <div>
            <h2>Products</h2>
            {/* Filter Inputs */}
            <div style={{ marginBottom: "1rem", display: "flex" }}>
                <label style={{ marginRight: "1rem", color: "blueviolet" }}>
                    Product Name:
                    <input
                        type="text"
                        name="productName"
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "8px",
                            border: "2px solid #ccc",
                            outline: "none",
                            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#f9f9f9",
                            width: "50%",
                        }}
                        value={filter.productName}
                        onChange={handleInputChange}
                        placeholder="Filter by product name"
                    />
                </label>
                <label style={{ marginRight: "1rem", color: "blueviolet" }}>
                    Category:
                    <input
                        type="text"
                        name="category"
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "8px",
                            border: "2px solid #ccc",
                            outline: "none",
                            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#f9f9f9",
                            width: "50%",
                        }}
                        value={filter.category}
                        onChange={handleInputChange}
                        placeholder="Filter by category"
                    />
                </label>
            </div>

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
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((prod) => (
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
