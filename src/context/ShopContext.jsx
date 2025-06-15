import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    // Try to load cart data from localStorage
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {}; // If no saved data, return an empty object
  });
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Save cartItems to localStorage whenever it changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log(cartItems);
  }, [cartItems]);

  // Generate a unique key for each combination of itemId, size, and attributes
  const generateUniqueKey = (itemId, size, attributes = {}, productName = "") => {
  const stringifyAttributes = (attributes) => {
    if (!attributes || typeof attributes !== "object") return "";

    return Object.entries(attributes)
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return `${key}:{${stringifyAttributes(value)}}`; // Recursively handle nested attributes
        } else {
          return `${key}:${value}`;
        }
      })
      .join("-");
  };

  const attributesKey = stringifyAttributes(attributes);
  // Include productName in the key. Sanitize if needed to avoid spaces or special chars
  const safeName = productName.replace(/\s+/g, "_").toLowerCase(); // example sanitation

  return `${safeName}-${itemId}-${size}-${attributesKey}`; // Now includes name
};


  // Updated addToCart to handle attributes
  const addToCart = async (itemId, size, price, attributes) => {
    const token = localStorage.getItem("token"); // Fetch the token directly
  
    const productData = products.find((product) => product._id === itemId);
    console.log("ye", productData.attributes);
  
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    const requiredAttributes = productData?.attributes || [];
const selectedAttributes = attributes || {};
console.log("🔍 Required attributes from product:", requiredAttributes);
console.log("🛒 Selected attributes:", selectedAttributes);
const missingAttributes = requiredAttributes.filter(attr => {
  const name = attr.name;
  return !(name in selectedAttributes) || selectedAttributes[name] === null || selectedAttributes[name] === "";
});

if (missingAttributes.length > 0) {
  toast.error("Please select all required product attributes.");
  return;
}

    if (!price) {
      toast.error("No Price included");
      return;
    }
  
    let cartData = structuredClone(cartItems); // Ensure no direct mutation
    //console.log(cartData);
  
    // Generate a unique key combining itemId, size, and attributes
    const attributeKey = generateUniqueKey( itemId, size, attributes);
    console.log("Generated attributeKey:", attributeKey);
  
    console.log("Product Data for this item:", productData);
  
    // Initialize cartData[itemId] if it's not already present
    if (!cartData[itemId]) {
      cartData[itemId] = {}; // Initialize if not present
    }
  
    // Check if the item with the unique key already exists in the cart
    if (!cartData[itemId][attributeKey]) {
      console.log("No existing item for this key, adding new item.");
      cartData[itemId][attributeKey] = {
        id: itemId,
        quantity: 1,
        price: price,
        attributes: attributes,
        size: size,
        image: [productData.image[0]], // Store the first image
        name: productData.name, // Store product name
      };
    } else {
      console.log("Item already exists for this key, increasing quantity.");
      cartData[itemId][attributeKey].quantity += 1;
    }
  
    // Update the cart state with the new cartData
    setCartItems(cartData);
    toast.success(`${productData.name} has been added to your cart!`);

    console.log("Updated Cart Data:", cartData);
  
    if (token) {
      try {
        const response = await axios.post(
          backendUrl + "/api/cart/add",
          {
            itemId,
            size,
            attributes, // Added attributes to request
            name: productData.name, // Added name to request
            price,
          },
          {
            headers: {
              token: token, // Include token in 'token' header
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };
  
  // Update the quantity of items in the cart
  const updateQuantity = async (itemId, size, attributes, quantity) => {
  let cartData = structuredClone(cartItems);
  const attributeKey = generateUniqueKey(itemId, size, attributes);
  const token = localStorage.getItem("token");

  if (cartData[itemId] && cartData[itemId][attributeKey]) {
    if (quantity === 0) {
      delete cartData[itemId][attributeKey];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][attributeKey].quantity = quantity;
    }
  }

  setCartItems(cartData);

  // 🔥 Backend sync
  if (token) {
    try {
      await axios.post(
  backendUrl + "/api/cart/update",
  { itemId, size, attributes, quantity },
  { headers: { token } }
);

    } catch (err) {
      console.error("Error syncing cart with DB:", err);
      toast.error("Failed to sync cart changes.");
    }
  }
};


  // Get total cart count (number of items)
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const { quantity } = cartItems[itemId][size];
        if (quantity > 0) {
          totalCount += quantity;
        }
      }
    }
    return totalCount;
  };

  // Get total cart amount (price)
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      for (const size in cartItems[itemId]) {
        const { price, quantity, attributes } = cartItems[itemId][size];
        if (quantity > 0 && price > 0) {
          totalAmount += price * quantity;
        }
      }
    }
    return totalAmount;
  };

  // Fetch product data
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      setProducts(response.data.products);
      console.log(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Clear the cart
 // Clear the cart
 const clearCart = async () => {

  

  try {
    const response = await axios.post(
      backendUrl + "/api/cart/clear",
      {}, // Ensure this matches what your controller expects
    );

    console.log("🟢 clearCart Response:", response.data);
    setCartItems({}); 
    localStorage.removeItem("cartItems"); // Clear localStorage too
    toast.success("Cart has been cleared successfully.");
  } catch (error) {
    console.error("🔴 Error clearing cart:", error.response?.data || error.message);
    toast.error("Failed to clear cart.");
  }
};


  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    getProductsData,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    clearCart,
    generateUniqueKey
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
