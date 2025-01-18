import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import CategoryTable from "./Component/CategoryTable";
import ProductTable from "./Component/ProductTable";
import TransactionTable from "./Component/TransactionTable";
import "./App.css";
// Navigation component
const Navigation = () => {
  const location = useLocation(); // To get the current location for highlighting the active link
  return (
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={location.pathname === "/categories" ? { fontWeight: "bold"} : {}}>
            <Link to="/categories">Categories</Link>
          </li>
          <li style={location.pathname === "/products" ? { fontWeight: "bold"} : {}}>
            <Link to="/products">Products</Link>
          </li>
          <li style={location.pathname === "/transactions" ? { fontWeight: "bold"} : {}}>
            <Link to="/transactions">Transactions</Link>
          </li>
        </ul>
      </nav>
  );
};

const App = () => {
  return (
      <Router>
        <div>
          <Navigation /> {/* Render Navigation */}
          <Routes>
            <Route path="/categories" element={<CategoryTable />} />
            <Route path="/products" element={<ProductTable />} />
            <Route path="/transactions" element={<TransactionTable />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
