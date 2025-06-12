import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { useState } from 'react';

function ProductItem({id, image, name, sizes}) {
    const {currency} = useContext(ShopContext)
    const [selectedPrice, setSelectedPrice] = useState(null); // State to hold the selected price

  return (
    <div>
      <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden'>
            <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{sizes}</p>
      </Link>
    </div>
  )
}

export default ProductItem
