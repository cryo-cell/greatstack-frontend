import React from 'react';

const ProductForm = ({ productData }) => {
  // Initialize an empty array to collect all options
  let allOptions = [];

  // Iterate over the attributes and collect the 'values' for 'radio' type attributes
  productData.attributes.forEach((item) => {
    if (item.visible && item.type === 'radio' && Array.isArray(item.values)) {
      allOptions = [...allOptions, ...item.values]; // Add the values to the options array
    }
  });

  return (
    <div className="mb-4">
      <label className="font-medium">Choose an Option</label>
      <select className="w-full p-2 border rounded mt-2">
        <option value="">Select an option</option>
        {/* Check if allOptions has values */}
        {allOptions.length > 0 ? (
          allOptions.map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))
        ) : (
          <option disabled>No options available</option>
        )}
      </select>
    </div>
  );
}

export default ProductForm;
