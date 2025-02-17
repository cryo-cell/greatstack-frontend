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
  const generateUniqueKey = (itemId, size, attributes) => {
    const stringifyAttributes = (attributes) => {
      if (typeof attributes !== 'object' || attributes === null) {
        return attributes;
      }
  
      // Handle objects or arrays
      return Object.entries(attributes)
        .map(([key, value]) => `${key}:${typeof value === 'object' ? stringifyAttributes(value) : value}`)
        .join("-");
    };
  
    const attributesKey = attributes ? stringifyAttributes(attributes) : '';
    return `${itemId}-${size}-${attributesKey}`; // Unique key combining itemId, size, and attributes
  };

  // Updated addToCart to handle attributes
  const addToCart = async (itemId, size, price, attributes) => {
    const productData = products.find((product) => product._id === itemId);
    console.log(productData.attributes)
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    if (!attributes || Object.keys(attributes).length === 0) {
      toast.error("Select Product Attributes");
      return;
    }
    if (!price) {
      toast.error("No Price included");
      return;
    }

    let cartData = structuredClone(cartItems); // Ensure no direct mutation
    console.log(cartData);

    // Generate a unique key combining itemId, size, and attributes
    const attributeKey = generateUniqueKey(itemId, size, productData.attributes);
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
    console.log("Updated Cart Data:", cartData);

    if (token) {
      try {
        const response = await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          {
            headers: {
              token: token, // Include token in 'token' header
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // Update the quantity of items in the cart
  const updateQuantity = async (itemId, size, attributes, quantity) => {
    let cartData = structuredClone(cartItems); // Deep clone cart items to avoid mutation

    // Generate the unique attribute key
    const attributeKey = generateUniqueKey(itemId, size, attributes);

    console.log("Updating item with key:", attributeKey);

    // Check if the item exists in the cart
    if (cartData[itemId]) {
      // Check if the specific size and attributes exist in the cart for this product
      if (cartData[itemId][attributeKey]) {
        // Update quantity if the key exists
        if (quantity === 0) {
          // If quantity is 0, remove the item from the cart
          console.log("Removing item with itemId:", itemId, "and key:", attributeKey);
          delete cartData[itemId][attributeKey];

          // If no other items for this product exist, delete the product from the cart
          if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
          }
        } else {
          // Update the quantity of the item
          cartData[itemId][attributeKey].quantity = quantity; // Update the quantity
        }
      } else {
        console.log("Item not found in cart with this key:", attributeKey);
      }
    } else {
      console.log("Product not found in cart.");
    }

    // Set the updated cart data into the state
    setCartItems(cartData);
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
  const clearCart = () => {
    setCartItems({}); // Clear the cart in state
    localStorage.removeItem("cartItems"); // Remove cart from localStorage
    toast.success("Cart has been cleared"); // Optionally show a success message
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
