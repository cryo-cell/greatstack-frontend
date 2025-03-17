import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
const Verify = () => {

    const {navigate, token, setCartItems, backendUrl} = useContext(ShopContext)
    const [searchParams, setSearchParams] = useParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try {
            if(!token){
                return null
            }
            const response = await axios.post(backendUrl + '/api/order/verifyStripe',{success, orderId},{headers:{token}})
            if(response.data.success){
                setCartItems({})
                navigate('/orders')
            }else{
                navigate('/cart')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.messageS)
        }
    }

    useEffect(()=>{
        verifyPayment()
    },[token])
  return (
    <div>
      
    </div>
  )
}

export default Verify
