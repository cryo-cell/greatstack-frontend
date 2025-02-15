import React, { createContext, useState, useContext } from 'react';

const AttributeContext = createContext();

export const useAttributeContext = () => {
  return useContext(AttributeContext);
};

export const AttributeProvider = ({ children }) => {
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Update selected attributes for a specific product
  const updateAttributes = (productId, updatedAttributes) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [productId]: updatedAttributes,
    }));
  };

  return (
    <AttributeContext.Provider value={{ selectedAttributes, updateAttributes }}>
      {children}
    </AttributeContext.Provider>
  );
};
