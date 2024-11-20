import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://backendju-3.onrender.com/api/products');
        setItems(response.data); // Update the state with fetched products
      } catch (error) {
        console.log('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Calculate items in cart and total price
  const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Add an item to the cart
  const addToCart = (product) => {
    if (!product || !product._id) return;

    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove an item from the cart
  const removeFromCart = (product) => {
    if (!product || !product._id) return;

    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          return prevCart.map((item) =>
            item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item
          );
        }
        return prevCart.filter((item) => item._id !== product._id);
      }
      return prevCart;
    });
  };

  return (
    <ItemContext.Provider
      value={{
        items,
        cart,          // Provide cart array for accessing exact items in Header and other components
        addToCart,
        removeFromCart,
        itemsInCart,
        totalPrice,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItemContext = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItemContext must be used within an ItemProvider');
  }
  return context;
};

export default ItemContext;
