import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch, getProductsData } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 }); // Adjust max as needed
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
    console.log("Original products:", products);

    // Apply search filter
    if (showSearch && search) {
        productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        console.log("After search filter:", productsCopy);
    }

    // Apply category filter
    if (category.length > 0) {
        productsCopy = productsCopy.filter(item => category.includes(item.category));
        console.log("After category filter:", productsCopy);
    }

    // Apply subcategory filter
    if (subCategory.length > 0) {
        productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
        console.log("After subcategory filter:", productsCopy);
    }

    // Apply price range filter
    /*if (priceRange) {
        productsCopy = productsCopy.filter(item => {
            const itemPrice = item.sizes.price; // Adjust this as needed
            return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
        });
        console.log("After price range filter:", productsCopy);
    }
*/
    // Update filtered products
    setFilterProducts(productsCopy);

    // Sort the filtered products
    setTimeout(sortProduct, 0);
};


  const sortProduct = () => {
    let fpCopy = filterProducts.slice(); // Create a copy of filtered products
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => 
          a.sizes[a.sizes.length - 1].price - b.sizes[0].price
        ));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => 
          b.sizes[b.sizes.length - 1].price - a.sizes[0].price
        ));
        break;
    }
  };

  useEffect(() => {
  // Fetch products again if products are not in state or need to be re-fetched
  if (products.length === 0) {
    getProductsData();  // Make sure products are fetched again if needed
  }
}, [products]);
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, priceRange]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

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
            showFilter ? '' : 'hidden'
          }`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gra-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Vapes'}
                onChange={toggleCategory}
              />
              Vapes
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Smokes'}
                onChange={toggleCategory}
              />
              Smokes
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Edibles'}
                onChange={toggleCategory}
              />
              Edibles
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Drinks'}
                onChange={toggleCategory}
              />
              Drinks
            </p>
          </div>
        </div>
        {/*SubCategory Filter*/}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? '' : 'hidden'
          }`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gra-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'THC'}
                onChange={toggleSubCategory}
              />
              THC
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Nicotine'}
                onChange={toggleSubCategory}
              />
              NICOTINE
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Kava'}
                onChange={toggleSubCategory}
              />
              KAVA
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Kratom'}
                onChange={toggleSubCategory}
              />
              KRATOM
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Mushrooms'}
                onChange={toggleSubCategory}
              />
              MUSHROOMS
            </p>
          </div>
        </div>
        {/* Price Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6`}>
          <p className="mb-3 text-sm font-medium">PRICE RANGE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gra-700">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: Number(e.target.value) })
              }
              className="border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: Number(e.target.value) })
              }
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4 ">
          <Title text1={'All'} text2={'COLLECTIONS'} />
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
          {filterProducts.map((item, index) => (
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} sizes={item.sizes[0]?item.sizes[0].price:''}/>

          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
