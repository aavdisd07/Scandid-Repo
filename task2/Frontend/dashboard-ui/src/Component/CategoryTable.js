import React, { useEffect, useState } from 'react';

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        productName: "",
        category: ""
    });

    // Fetch category data from the backend
    useEffect(() => {
        fetch('http://localhost:3000/api/categories')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch categories');
                setLoading(false);
            });
    }, []);

    // Handle input change for filters
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilter({
            ...filter,
            [name]: value
        });
    };

    // Filter categories based on filter values
    const filteredCategories = categories.filter((category) => {
        const categoryName = category.Category_Name ? category.Category_Name.toLowerCase() : '';

        return (
            categoryName.includes(filter.category.toLowerCase())
        );
    });



    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Categories</h2>

            {/* Filter Inputs */}
            <div style={{ marginBottom: "1rem", display: "flex" }}>
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

            {/* Category Table */}
            <table>
                <thead>
                <tr>
                    <th>Category ID</th>
                    <th>Category Name</th>
                </tr>
                </thead>
                <tbody>
                {filteredCategories.map((category, index) => (
                    <tr key={index}>
                        <td>{category.Category_ID}</td>
                        <td>{category.Category_Name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;
