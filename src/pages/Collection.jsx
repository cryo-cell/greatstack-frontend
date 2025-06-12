import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import axios from "axios";
const Collection = () => {
  const { products, search, showSearch, getProductsData } =
    useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  useEffect(() => {
    if (!products || products.length === 0) return;

    const catSet = new Set();
    const subSet = new Set();

    products.forEach((p) => {
      if (p.category) catSet.add(p.category);
      if (p.subCategory) subSet.add(p.subCategory);
    });

    setCategoryOptions(Array.from(catSet));
    setSubCategoryOptions(Array.from(subSet));
  }, [products]);

  useEffect(() => {
    if (products && products.length > 0) {
      setFilterProducts(products);
    }
  }, [products]);
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Apply search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // Subcategory
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Price Range
    if (priceRange) {
      const min = parseFloat(priceRange.min) || 0;
      const max = parseFloat(priceRange.max) || Infinity;

      productsCopy = productsCopy.filter((item) => {
        const prices = item.sizes.map((s) => s.price);
        const itemMinPrice = Math.min(...prices);
        const itemMaxPrice = Math.max(...prices);

        // Check if the item's price range overlaps with filter range
        return itemMinPrice <= max && itemMaxPrice >= min;
      });
    }

    // Sort
    switch (sortType) {
      case "low-high":
        productsCopy.sort(
          (a, b) =>
            Math.min(...a.sizes.map((s) => s.price)) -
            Math.min(...b.sizes.map((s) => s.price))
        );
        break;
      case "high-low":
        productsCopy.sort(
          (a, b) =>
            Math.max(...b.sizes.map((s) => s.price)) -
            Math.max(...a.sizes.map((s) => s.price))
        );
        break;
    }

    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    // Fetch products again if products are not in state or need to be re-fetched
    if (products.length === 0) {
      getProductsData(); // Make sure products are fetched again if needed
    }
  }, [products]);
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, priceRange, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/*Filter Options*/}
      <div className="min-w-40">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
        </p>
        {/*Category Filter*/}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gra-700">
            {categoryOptions.map((cat, index) => (
              <p key={index} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                />
                {cat}
              </p>
            ))}
          </div>
        </div>
        {/*SubCategory Filter*/}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gra-700">
            {subCategoryOptions.map((sub, index) => (
              <p key={index} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={sub}
                  onChange={toggleSubCategory}
                />
                {sub}
              </p>
            ))}
          </div>
        </div>
        {/* Price Filter */}
        <div className={`border border-gray-300  p-5 mt-6`}>
          <p className="mb-3 text-sm font-medium">PRICE RANGE</p>
          <p className="text-xs text-gray-500">
            Showing items between ${priceRange.min} and ${priceRange.max}
          </p>

          <div className="flex flex-col gap-2 text-sm font-light text-gra-700">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value })
              }
              className="border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: e.target.value })
              }
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4 ">
          <Title text1={"All"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relavency</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => {
            const minPrice = Math.min(...item.sizes.map((s) => s.price));
            const maxPrice = Math.max(...item.sizes.map((s) => s.price));
            return (
              <ProductItem
                key={index}
                id={item._id}
                image={item.image}
                name={item.name}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Collection;
