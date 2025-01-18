import React, { useEffect, useState } from 'react';

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Categories</h2>
            <table>
                <thead>
                <tr>
                    <th>Category ID</th>
                    <th>Category Name</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((category, index) => (
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
