import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
function PlaceOrder() {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    cartItems,
    setCartItems,
    getCartAmount,
    products,
  } = useContext(ShopContext);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    createAccount: false,
    password: "",
    confirmPassword: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("🟢 onSubmitHandler fired"); // Confirm function call

    try {
      let orderItems = [];
      for (const items in cartItems) {
        console.log(items);
        for (const item in cartItems[items]) {
          if (cartItems[items][item]) {
            console.log(item);
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            console.log(itemInfo);
            if (itemInfo) {
              itemInfo.name = cartItems[items][item].name;
              itemInfo.price = cartItems[items][item].price;
              itemInfo.attributes = cartItems[items][item].attributes;
              itemInfo.size = cartItems[items][item].size;
              itemInfo.quantity = cartItems[items][item].quantity;
              orderItems.push(itemInfo);
              console.log(itemInfo);
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount(),
      };

      console.log(token);
      switch (method) {
        //api call for COD
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          console.log(response.data);
          if (response.data.success) {
            console.log("cod");

            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            console.log(session_url);
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
  const isCartEmpty = Object.keys(cartItems).length === 0;
  if (isCartEmpty) {
    toast.info("Your cart is empty. Add items before checking out.");
    navigate('/');
  }
}, [cartItems, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]"
    >
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"ORDER"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder="First name"
            className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last name"
            className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email address"
          className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
        />

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder="Zipcode"
            className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="number"
          placeholder="Phone"
          className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
        />
        {!token && (
          <>
            <label className="flex gap-2 items-center text-sm">
              <input
                type="checkbox"
                checked={formData.createAccount}
                onChange={() =>
                  setFormData((data) => ({
                    ...data,
                    createAccount: !data.createAccount,
                  }))
                }
              />
              Create an account with this email
            </label>
            {formData.createAccount && (
              <>
                <input
                  required
                  onChange={onChangeHandler}
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
                />
                <input
                  required
                  onChange={onChangeHandler}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
                />
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} />
              <p className="text-gray-500 text-sm font-medium mx-4">STRIPE </p>
            </div>

            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                RAZORPAY{" "}
              </p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY{" "}
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={Object.keys(cartItems).length === 0}
              className={`bg-black text-white px-16 py-3 text-sm ${
                Object.keys(cartItems).length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
