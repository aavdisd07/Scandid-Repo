import React, { useEffect, useState } from "react";

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        productName: "",
        category: "",
    });

    // Function to format Unix timestamp to a human-readable date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Fetch transaction data from the backend
    useEffect(() => {
        fetch("http://localhost:3000/api/transaction")
            .then((response) => response.json())
            .then((data) => {
                setTransactions(data);
                setFilteredTransactions(data); // Initialize filtered data
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch data");
                setLoading(false);
            });
    }, []);

    // Filter transactions based on user input
    useEffect(() => {
        const filtered = transactions.filter((transaction) => {
            return (
                transaction.product_name
                    .toLowerCase()
                    .includes(filter.productName.toLowerCase()) &&
                transaction.category
                    .toLowerCase()
                    .includes(filter.category.toLowerCase())
            );
        });
        setFilteredTransactions(filtered);
    }, [filter, transactions]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Transaction Data</h2>

            {/* Filter Inputs */}
            <div style={{ marginBottom: "1rem",display: "flex" }}>
                <label style={{ marginRight: "1rem" ,color:"blueviolet"}}>
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
                <label style={{ marginRight: "1rem" ,color:"blueviolet"}}>
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

            {/* Transaction Table */}
            <table>
                <thead>
                <tr>
                    <th>Transaction Date</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                </tr>
                </thead>
                <tbody>
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{formatDate(transaction.transaction_date)}</td>
                            <td>{transaction.product_name}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.quantity}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No transactions found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
