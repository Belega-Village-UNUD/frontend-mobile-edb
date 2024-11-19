// src/provider/CartProvider.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URI } from "@env";

export const CartContext = createContext();

const GET_CART_URI = `${BASE_URI}/api/cart`;

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);

  const fetchCartData = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(GET_CART_URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCartData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const clearCartData = () => {
    setCartData([]);
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartData, setCartData, fetchCartData, clearCartData }}
    >
      {children}
    </CartContext.Provider>
  );
};
