import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

function LatestCollection() {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  if (!products || products.length === 0) {
    return <div>Loading products...</div>; // Show loading state until products are fetched
  }

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={'LATEST'} text2={'COLLECTION'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum sed similique cumque iste, expedita eum accusamus, architecto ipsum error esse quos nisi repellat quas reiciendis voluptatem sunt perspiciatis. Qui, alias.
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => {
          const minPrice = Math.min(...item.sizes.map((s) => s.price));
const maxPrice = Math.max(...item.sizes.map((s) => s.price));

          return(
          
<ProductItem
  key={index}
  id={item._id}
  image={item.image}
  name={item.name}
  sizes={item.sizes}
  minPrice={minPrice}
  maxPrice={maxPrice}
/>

        )
})}
      </div>
    </div>
  );
}

export default LatestCollection;
