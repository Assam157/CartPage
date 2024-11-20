import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import { useItemContext } from '../context/ItemContext';
import axios from 'axios';  // Assuming you are using axios for API calls
import { Navigate, useNavigate } from 'react-router-dom';

const ProductList = () => {
    const { items } = useItemContext(); // Access context values (products)
    const [sortedProducts, setSortedProducts] = useState([]); // Initialize with empty array
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(3000);
    const [selectedType, setSelectedType] = useState('all');
    const [productTypes, setProductTypes] = useState([]);
    const navigate=useNavigate();
    // Fetch products and extract unique product types
    useEffect(() => {
 const fetchProducts = async () => {
    try {
        // Make the API request to the backend
        const response = await axios.get('https://backendju-3.onrender.com/api/products'); // Adjust the API endpoint as needed

        // Check if response is successful
        if (response.status === 200) {
            const products = response.data;

            // Check if products data is an array
            if (Array.isArray(products)) {
                console.log("Products fetched successfully:", products);
                
                // Extract unique product types from the products
                const types = [...new Set(products.map(product => product.type))];
                console.log("Unique product types:", types);

                // Set state for product types and products
                setProductTypes(types);
                setSortedProducts(products);
            } else {
                console.error("Expected an array of products, but got:", products);
            }
        } else {
            console.error("Failed to fetch products. Status:", response.status);
        }
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching products:', error.message || error);
        if (error.response) {
            // If the error comes from the server (response)
            console.error("Response error:", error.response.data);
        } else if (error.request) {
            // If no response was received
            console.error("No response received:", error.request);
        } else {
            // Any other errors
            console.error("Error message:", error.message);
        }
    }
};

        fetchProducts();
    }, []); // Only run once on component mount

    // Update sortedProducts whenever items or filters change
    useEffect(() => {
        let filteredProducts = [...items]; // Use the items array to start with

        // Apply price range filter
        if (minPrice !== 0 || maxPrice !== 3000) {
            filteredProducts = filteredProducts.filter(
                (product) => product.price >= minPrice && product.price <= maxPrice
            );
        }

        // Apply type filter
        if (selectedType !== 'all') {
            filteredProducts = filteredProducts.filter(
                (product) => product.type === selectedType
            );
        }

        // Set sorted products after applying filters
        setSortedProducts(filteredProducts);
    }, [items, minPrice, maxPrice, selectedType]); // Avoid including sortedProducts in dependency array

    // Sort products by price
    const handleSortByPrice = () => {
        const sorted = [...sortedProducts].sort((a, b) => a.price - b.price);
        setSortedProducts(sorted);
    };

    // Handle Buy Now button
    const handleBuyNow = () => {
        console.log('Items to buy:', sortedProducts);
        // Implement purchasing logic here (e.g., create order)
    };

    return (
        <div className='prdt-list'>
            <div className='filter-btn'>
                <button onClick={handleSortByPrice}>Sort by Price</button>

                <label>
                    Min Price:
                    <input
                        type='number'
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                    />
                </label>

                <label>
                    Max Price:
                    <input
                        type='number'
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                </label>

                <button onClick={handleSortByPrice}>Filter by Price Range</button>

                <label>
                    Filter by Type:
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value='all'>All</option>
                        {productTypes.length > 0 ? (
                            productTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))
                        ) : (
                            <option value='all'>No types available</option>
                        )}
                    </select>
                </label>
            </div>

            <ul className='item-card'>
                {sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => (
                        <ProductItem
                            key={product._id} // Ensure key is unique
                            product={product}
                        />
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </ul>

           
        </div>
    );
};

export default ProductList;
