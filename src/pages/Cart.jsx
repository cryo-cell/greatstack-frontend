import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";

function Cart() {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    clearCart
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const key in cartItems[itemId]) {
        const itemDetails = cartItems[itemId][key]; // key could be the unique identifier for the item
        if (itemDetails && itemDetails.quantity > 0) {
          tempData.push({
            _id: itemId,
            ...itemDetails,
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]); // Re-run whenever cartItems change

  // Generate a unique key based on size and attributes
  const generateUniqueKey = (itemId, size, attributes) => {
    const stringifyAttributes = (attributes) => {
      if (typeof attributes !== 'object' || attributes === null) {
        return `${attributes}`;
      }
      return Object.entries(attributes)
        .map(([key, value]) => `${key}:${typeof value === 'object' ? stringifyAttributes(value) : value}`)
        .join("-");
    };
  
    const attributesKey = attributes ? stringifyAttributes(attributes) : '';
    return `${itemId}-${size}-${attributesKey}`;
  };
  

  // Function to render attributes as key-value pairs
  const renderAttributes = (attributes) => {
    if (!attributes || Object.keys(attributes).length === 0) {
      return <p>No attributes available</p>;
    }
  
    return Object.entries(attributes).map(([key, value]) => {
      const attributeKey = `${key}-${value}`;
  
      if (typeof value === "object" && value !== null) {
        // If the value is an object, render it in a readable way
        return (
          <div key={attributeKey}>
            <strong>{key}:</strong> {JSON.stringify(value)} {/* or format as needed */}
          </div>
        );
      } else {
        return (
          <div key={attributeKey} className="px-2 sm:px-13 sm:py-1 border bg-slate-50">
            <strong>{key}:</strong> {value}
          </div>
        );
      }
    });
  };
  

  const handleRemoveItem = (item) => {
    const uniqueKey = generateUniqueKey(item.size, item.attributes);
    updateQuantity(item._id, item.size, item.attributes, 0); // Remove item by setting quantity to 0
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          const itemAttributes = item.attributes || {}; // Default to empty object if attributes are undefined

          const uniqueKey = generateUniqueKey(item.size, itemAttributes);

          return (
            <div
              key={uniqueKey} // Ensure each item has a unique key
              className="py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5_-.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img className="w-16" src={item.image[0]} alt={item.name} />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{item.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {item.price}
                    </p>

                    <p className="px-2 sm:px-13 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>

                    {renderAttributes(itemAttributes)} {/* Render attributes per item */}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="quantity">Qty</label>
                <input
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value);
                    if (newQuantity > 0) {
                      updateQuantity(
                        item._id,
                        item.size,
                        itemAttributes,
                        newQuantity
                      );
                    }
                  }}
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  name="quantity"
                />
              </div>

              <p
                onClick={() => handleRemoveItem(item)} // Remove item on click
                className="cursor-pointer text-red-500"
              >
                remove
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <p onClick={clearCart} className="cursor-pointer text-red-500">
          clear
        </p>
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
