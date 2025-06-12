import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { useState } from 'react';

function ProductItem({ id, image, name, sizes, minPrice, maxPrice }) {
  const { currency } = useContext(ShopContext);
  const [selectedPrice, setSelectedPrice] = useState(null); // If you need this

  return (
    <div>
      <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
        <div className="overflow-hidden">
          <img
            className="hover:scale-110 transition ease-in-out"
            src={image[0]}
            alt=""
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p>
          {minPrice === maxPrice
            ? `$${minPrice.toFixed(2)}`
            : `From $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`}
        </p>
        {/* You probably want to remove this line or clarify what sizes means here */}
        {/* <p className="text-sm font-medium">{currency}{sizes}</p> */}
      </Link>
    </div>
  );
}

export default ProductItem
