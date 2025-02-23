import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      console.log("Product Data:", selectedProduct);
      setImage(selectedProduct.image[0]);
      setSelectedPrice(selectedProduct.sizes[0]?.price);
    }
  }, [productId, products]);

  useEffect(() => {
    if (productData) {
      console.log("Updated Product Data:", productData);
    }
  }, [productData]);

  const handleAttributeChange = (groupName, value, isMultiSelect = false) => {
    setSelectedAttributes((prevState) => {
      if (isMultiSelect) {
        const currentValues = prevState[groupName] || [];
        const updatedValues = currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value];
        return {
          ...prevState,
          [groupName]: updatedValues,
        };
      } else {
        return {
          ...prevState,
          [groupName]: value,
        };
      }
    });
  };

  const handleSizeChange = (size, price) => {
    setSize(size);
    setSelectedPrice(price);
  };

  const renderAttributes = () => {
    if (!productData?.attributeGroups || productData.attributeGroups.length === 0) {
      return <p>No attribute groups available.</p>;
    }

    return productData.attributeGroups.map((group, groupIndex) => (
      <div key={groupIndex} className="mt-5">
        <h3 className="font-medium text-lg">{group.name}</h3>
        <div className="mt-2">
          {group.type === "radio" && (
            <select
              value={selectedAttributes[group.name] || ""}
              onChange={(e) => handleAttributeChange(group.name, e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">Select an option</option>
              {group.attributes.map((attribute, attributeIndex) => (
                <option key={attributeIndex} value={attribute.name}>
                  {attribute.name}
                </option>
              ))}
            </select>
          )}

          {group.type === "checkbox" && (
            <div className="flex flex-wrap gap-2">
              {group.attributes.map((attribute, attributeIndex) => (
                <label key={attributeIndex} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`${group.name}-${attribute.name}`}
                    value={attribute.name}
                    checked={
                      selectedAttributes[group.name]?.includes(attribute.name) || false
                    }
                    onChange={(e) =>
                      handleAttributeChange(group.name, e.target.value, true)
                    }
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
        {/* Product Images */}
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

        {/* Product Info */}
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

          <div className="mt-5 text-3xl font-medium">
            {currency}
            {selectedPrice ? selectedPrice : productData.sizes[0]?.price}
          </div>

          {/* Render Attribute Groups */}
          {renderAttributes()}

          {/* Size Selection */}
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
              console.log("Cart Data:", cartData);
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

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;