import React, { createContext, useState, useContext } from 'react';

const AttributeContext = createContext();

export const useAttributeContext = () => {
  return useContext(AttributeContext);
};

export const AttributeProvider = ({ children }) => {
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Update selected attributes for a specific product
  // AttributeContext.js
const updateAttributes = (productId, newAttributes) => {
  setSelectedAttributes((prevAttributes) => ({
    ...prevAttributes,
    [productId]: {
      ...prevAttributes[productId], // Keep existing attributes for the product
      ...newAttributes, // Update with new attributes
    },
  }));
};


  return (
    <AttributeContext.Provider value={{ selectedAttributes, updateAttributes }}>
      {children}
    </AttributeContext.Provider>
  );
};
