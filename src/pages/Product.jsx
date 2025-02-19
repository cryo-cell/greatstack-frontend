import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { useAttributeContext } from "../context/AttributeContext";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  //const { selectedAttributes, updateAttributes } = useAttributeContext();
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      console.log("Product Data:", selectedProduct); // Log attributes
      setImage(selectedProduct.image[0]);
      setSelectedPrice(selectedProduct.sizes[0]?.price); // Set default price from the first size
    }
  }, [productId, products]);

  // Fetch product data based on productId
  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      console.log(productData);
      setImage(selectedProduct.image[0]);
      setSelectedPrice(selectedProduct.sizes[0]?.price); // Set default price from the first size
    }
  }, [productId, products]);

  useEffect(() => {
    if (productData) {
      console.log("Product Data:", productData);
    }
  }, [productData]);

  // Get selected attributes for this product
  const currentSelectedAttributes = selectedAttributes[productId] || {};

  // Handle attribute changes dynamically
  const handleAttributeChange = (groupName, attributeName) => {
    setSelectedAttributes((prevState) => ({
      ...prevState,
      [groupName]: attributeName,
    }));
  };
  console.log(selectedAttributes)

  // Handle size selection
  const handleSizeChange = (size, price) => {
    setSize(size);
    setSelectedPrice(price);
  };

  // Render attributes as buttons (like sizes)
  const renderAttributes = () => {
    return productData.attributes.map((attributeGroup, groupIndex) => (
      <div key={groupIndex} className="mt-5">
        <h3 className="font-medium text-lg">{attributeGroup.name}</h3>
        <div className="mt-2">
          {attributeGroup.type === "select" && (
            <select
              value={selectedAttributes[attributeGroup.name] || ""}
              onChange={(e) =>
                handleAttributeChange(attributeGroup.name, e.target.value)
              }
              className="p-2 border rounded"
            >
              <option value="">Select an option</option>
              {attributeGroup.map((attribute, attributeIndex) => (
                <option key={attributeIndex} value={attribute.name}>
                  {attribute.name}
                </option>
              ))}
            </select>
          )}
  
          {attributeGroup.type === "radio" && (
            <div className="flex flex-wrap gap-2">
              {attributeGroup.map((attribute, attributeIndex) => (
                <label key={attributeIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={attributeGroup.name}
                    value={attribute.name}
                    checked={
                      selectedAttributes[attributeGroup.name] === attribute.name
                    }
                    onChange={(e) =>
                      handleAttributeChange(attributeGroup.name, e.target.value)
                    }
                    className="mr-2"
                  />
                  {attribute.name}
                </label>
              ))}
            </div>
          )}
  
          {attributeGroup.type === "checkbox" && (
            <div className="flex flex-wrap gap-2">
              {attributeGroup.map((attribute, attributeIndex) => (
                <label key={attributeIndex} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`${attributeGroup.name}-${attribute.name}`}
                    value={attribute.name}
                    checked={
                      selectedAttributes[attributeGroup.name]?.includes(
                        attribute.name
                      ) || false
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedAttributes((prev) => {
                        const currentValues =
                          prev[attributeGroup.name] || [];
                        const updatedValues = isChecked
                          ? [...currentValues, attribute.name]
                          : currentValues.filter(
                              (value) => value !== attribute.name
                            );
                        return {
                          ...prev,
                          [attributeGroup.name]: updatedValues,
                        };
                      });
                    }}
                    className="mr-2"
                  />
                  {attribute.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    ));
  };
  

  if (!productData) {
    return <div className="opacity-0">Loading...</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ---Product Images--- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                alt=""
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* ---Product Info--- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {/* Rating */}
            <img src={assets.hero} alt="" className="w-3 5" />
            <img src={assets.hero} alt="" className="w-3 5" />
            <img src={assets.hero} alt="" className="w-3 5" />
            <img src={assets.hero} alt="" className="w-3 5" />
            <img src={assets.hero} alt="" className="w-3 5" />
          </div>

          {/* Price display */}
          <div className="mt-5 text-3xl font-medium">
            {currency}
            {selectedPrice ? selectedPrice : productData.sizes[0]?.price}
          </div>
          <div className="mt-5 text-3xl font-medium"></div>
          {/*productData.attributes.map((attributeGroup, groupIndex) => (
            <div key={groupIndex} className="mt-5">
              <h3 className="font-medium text-lg">{attributeGroup.name}</h3>
              <select
                value={currentSelectedAttributes[attributeGroup.name] || ""}
                onChange={(e) => handleAttributeChange(e, attributeGroup.name)}
              >
                <option value="">Select option</option>
                {attributeGroup.map((attribute, attrIndex) => (
                  <option key={attrIndex} value={attribute}>
                    {attribute.name}
                  </option>
                ))}
              </select>
            </div>
          ))*/}
{productData.attributes.map((attributeGroup, groupIndex) => (
      <div key={groupIndex} className="mt-5">
        <h3 className="font-medium text-lg">{attributeGroup.name}</h3>
        <div className="mt-2">
          {attributeGroup.type === "select" && (
            <select
              value={selectedAttributes[attributeGroup.name] || ""}
              onChange={(e) =>
                handleAttributeChange(attributeGroup.name, e.target.value)
              }
              className="p-2 border rounded"
            >
              <option value="">Select an option</option>
              {attributeGroup.map((attribute, attributeIndex) => (
                <option key={attributeIndex} value={attribute.name}>
                  {attribute.name}
                </option>
              ))}
            </select>
          )}
  
          {attributeGroup.type === "radio" && (
            <div className="flex flex-wrap gap-2">
              {attributeGroup.map((attribute, attributeIndex) => (
                <label key={attributeIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={attributeGroup.name}
                    value={attribute.name}
                    checked={
                      selectedAttributes[attributeGroup.name] === attribute.name
                    }
                    onChange={(e) =>
                      handleAttributeChange(attributeGroup.name, e.target.value)
                    }
                    className="mr-2"
                  />
                  {attribute.name}
                </label>
              ))}
            </div>
          )}
  
          {attributeGroup.type === "checkbox" && (
            <div className="flex flex-wrap gap-2">
              {attributeGroup.map((attribute, attributeIndex) => (
                <label key={attributeIndex} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`${attributeGroup.name}-${attribute.name}`}
                    value={attribute.name}
                    checked={
                      selectedAttributes[attributeGroup.name]?.includes(
                        attribute.name
                      ) || false
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedAttributes((prev) => {
                        const currentValues =
                          prev[attributeGroup.name] || [];
                        const updatedValues = isChecked
                          ? [...currentValues, attribute.name]
                          : currentValues.filter(
                              (value) => value !== attribute.name
                            );
                        return {
                          ...prev,
                          [attributeGroup.name]: updatedValues,
                        };
                      });
                    }}
                    className="mr-2"
                  />
                  {attribute.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    ))
  }
          {/* Render Attributes */}
          {productData.attributes.map((attributeGroup, groupIndex) => (
            <div key={groupIndex} className="mt-5">
              <h3 className="font-medium text-lg">{attributeGroup.name}</h3>
            </div>
          ))}
          {productData.attributes.map((attributeGroup, groupIndex) => (
  attributeGroup && (
    <div key={groupIndex} className="mt-5">
      <h3 className="font-medium text-lg">{attributeGroup.name}</h3>

      {/* Render dropdown for "radio" */}
      {attributeGroup.some((attribute) => attribute.type === "radio") && (
        <select
          value={selectedAttributes[`group-${groupIndex}`] || ""}
          onChange={(e) =>
            handleAttributeChange(`group-${groupIndex}`, e.target.value)
          }
          className="p-2 border rounded"
        >
          <option value="">Select an option</option>
          {attributeGroup.map((attribute, attributeIndex) =>
            attribute.type === "radio" ? (
              <option key={attributeIndex} value={attribute.name}>
                {attribute.name}
              </option>
            ) : null
          )}
        </select>
      )}

      {/* Render checkboxes for "checkbox" */}
      {attributeGroup.map((attribute, attributeIndex) => (
        attribute.type === "checkbox" && (
          <label key={attributeIndex} className="block mt-2">
            <input
              type="checkbox"
              name={attribute.name}
              value={attribute.name}
              checked={
                selectedAttributes[`group-${groupIndex}`]?.includes(attribute.name) || false
              }
              onChange={(e) => {
                const currentValues = selectedAttributes[`group-${groupIndex}`] || [];
                const newValues = e.target.checked
                  ? [...currentValues, attribute.name]
                  : currentValues.filter((v) => v !== attribute.name);
                handleAttributeChange(`group-${groupIndex}`, newValues);
              }}
              className="mr-2"
            />
            {attribute.name}
          </label>
        )
      ))}
    </div>
  )
))}


          {/* Size selection */}
          <div className="mt-5">
            <h3 className="font-medium text-lg">Select Size</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  className={`p-2 border ${
                    size === item.size ? "bg-black text-white" : "bg-gray-100"
                  }`}
                  onClick={() => handleSizeChange(item.size, item.price)}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              const cartData = {
                productId: productData._id,
                size: size,
                price: selectedPrice,
                attributes: selectedAttributes,
              };
              console.log("Cart Data:", cartData); // Log cart data for testing
              addToCart(
                cartData.productId,
                cartData.size,
                cartData.price,
                cartData.attributes
              );
            }}
            className="mt-5 bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            Add to Cart
          </button>

          <hr className="mt-8 sm:w-4/5" />
        </div>
      </div>

      {/* ---Display Related Products--- */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
