import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);

    // Correct way to extract parameters from useParams in React Router v6
    const { success, orderId } = useParams(); // Destructure parameters from useParams

    const verifyPayment = async () => {
        try {
            if (!token) {
                return null;
            }
            const response = await axios.post(
                backendUrl + '/api/order/verifyStripe',
                { success, orderId },
                { headers: { token } }
            );
            if (response.data.success) {
                setCartItems({});
                navigate('/orders');
            } else {
                navigate('/place-order');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [token]);

    return (
        <div>
            {/* You can display a loading message or something else here while the verification is happening */}
            <h1>Verifying payment...</h1>
        </div>
    );
};

export default Verify;
