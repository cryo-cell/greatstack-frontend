import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { getTaxRate, stateNameToCode } from "../utils/taxUtils.js";

function Cart() {
  const { products, currency, cartItems, updateQuantity, navigate, clearCart } =
    useContext(ShopContext);

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
    if (!attributes || typeof attributes !== "object")
      return `${itemId}-${size}`;

    const entries = Object.entries(attributes).sort(); // ensures consistent order
    const attrString = entries.map(([key, val]) => `${key}:${val}`).join("-");
    return `${itemId}-${size}-${attrString}`;
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
          <div key={JSON.stringify(attributeKey)}>
            {JSON.stringify(value)} {/* or format as needed */}
          </div>
        );
      } else {
        return (
          <div
            key={JSON.stringify(attributeKey)}
            className="px-2 sm:px-13 sm:py-1  bg-slate-50"
          >
            {value}
          </div>
        );
      }
    });
  };

  const handleRemoveItem = (item) => {
    updateQuantity(item._id, item.size, item.attributes, 0); // Remove item by setting quantity to 0
  };
  const [selectedState, setSelectedState] = useState("");
  const [country, setCountry] = useState("United States");
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };
  const taxRate = getTaxRate(selectedState, country);
  return (
    <div className="-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          const itemAttributes = item.attributes || {}; // Default to empty object if attributes are undefined

          const uniqueKey = generateUniqueKey(
            item._id,
            item.size,
            itemAttributes
          );

          return (
            <div
              key={uniqueKey} // Ensure each item has a unique key
              className=" p-3 mb-6 mt-6 border-b text-gray-700 grid grid-cols-[4fr_0.5_-.5fr] sm:grid-cols-[4fr_4fr_4fr] "
            >
              <div className="mb-2 lg:mb-none md:mb-none flex items-start gap-6">
                <img className="w-16" src={item.image[0]} alt={item.name} />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{item.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p className="px-2 sm:px-13 sm:py-1  bg-slate-50">
                      {item.size}
                    </p>
                    {renderAttributes(itemAttributes)}{" "}
                    {/* Render attributes per item */}
                  </div>
                </div>
              </div>

              <div className="p-6  lg:col-start-3 md:col-start-3 md:ml-auto flex flex-row lg:ml-auto lg:flex-col lg:items-center">
                <div className=" mt-auto flex flex-col items-center">
                  <label htmlFor="quantity">Qty</label>
                  <div className="flex items-center ">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.size,
                          item.attributes,
                          Math.max(item.quantity - 1, 0)
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-10 hover:bg-opacity-20 transition"
                      aria-label="Decrease quantity"
                    >
                      –
                    </button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.size,
                          item.attributes,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-10 hover:bg-opacity-20 transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <p
                    onClick={() => handleRemoveItem(item)} // Remove item on click
                    className=" cursor-pointer text-red-500 mt-auto"
                  >
                    remove
                  </p>
                </div>
              </div>
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
          <div>
            <label>Select your state:</label>
            <select value={selectedState} onChange={handleStateChange}>
              <option value="">-- Select State --</option>
              {Object.keys(stateNameToCode).map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>

            <CartTotal taxRate={taxRate} />
          </div>{" "}
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
