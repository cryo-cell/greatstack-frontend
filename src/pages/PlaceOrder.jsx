import AddressAutocomplete from "./AddressAutocomplete";
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
    fullAddress: "",
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
        taxRate: taxRate, // <-- Add tax rate
        taxAmount: getCartAmount() * taxRate, // optional: precalc tax amount
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
      navigate("/");
    }
  }, [cartItems, navigate]);
  const taxRatesByState = {
    AL: 0.11,
    AK: 0.075,
    AZ: 0.112,
    AR: 0.115,
    CA: 0.1025,
    CO: 0.112,
    CT: 0.0635,
    DE: 0.0,
    FL: 0.08,
    GA: 0.09,
    HI: 0.045,
    ID: 0.09,
    IL: 0.11,
    IN: 0.07,
    IA: 0.08,
    KS: 0.106,
    KY: 0.06,
    LA: 0.1145,
    ME: 0.055,
    MD: 0.06,
    MA: 0.0625,
    MI: 0.06,
    MN: 0.08375,
    MS: 0.08,
    MO: 0.101,
    MT: 0.0,
    NE: 0.075,
    NV: 0.08265,
    NH: 0.0,
    NJ: 0.0663,
    NM: 0.090625,
    NY: 0.08875,
    NC: 0.075,
    ND: 0.085,
    OH: 0.08,
    OK: 0.115,
    OR: 0.0,
    PA: 0.08,
    RI: 0.07,
    SC: 0.09,
    SD: 0.065,
    TN: 0.1,
    TX: 0.0825,
    UT: 0.087,
    VT: 0.07,
    VA: 0.07,
    WA: 0.104,
    DC: 0.06,
    WV: 0.07,
    WI: 0.056,
    WY: 0.06,
  };
  const stateNameToCode = {
    
  "Alabama": "AL",
  "Alaska": "AK",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virginia": "VA",
  "Washington": "WA",
  "Washington, D.C.": "DC",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY"
}

  
  const getTaxRate = (state, country) => {
    let stateCode = state;
    if (country === "United States") {
      // If full state name, convert to code
      if (state.length > 2) {
        stateCode = stateNameToCode[state] || "";
      }
      return taxRatesByState[stateCode] || 0;
    }
    return 0;
  };
  const [taxRate, setTaxRate] = useState(0);

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
        <AddressAutocomplete
          onSelect={(place) => {
            const { address } = place;
            const state = address.state || "";
            const country = address.country || "";

            const rate = getTaxRate(state, country);
            setTaxRate(rate);

            setFormData((prev) => ({
              ...prev,
              fullAddress: place.display_name,
              street: address.road || "",
              city: address.city || address.town || "",
              state,
              zipcode: address.postcode || "",
              country,
            }));
          }}
        />

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
          <div className="mb-6">
            <p className="mb-2 font-semibold">Checkout as:</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="checkoutType"
                  value="guest"
                  checked={!formData.createAccount}
                  onChange={() =>
                    setFormData((data) => ({ ...data, createAccount: false }))
                  }
                />
                Guest
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="checkoutType"
                  value="createAccount"
                  checked={formData.createAccount}
                  onChange={() =>
                    setFormData((data) => ({ ...data, createAccount: true }))
                  }
                />
                Create an Account
              </label>
            </div>

            {formData.createAccount && (
              <div className="mt-4">
                <input
                  required={formData.createAccount}
                  onChange={onChangeHandler}
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password || ""}
                  className="border border-gray-500 rounded py-1.5 px-3.5 w-full mb-2"
                  autoComplete="new-password"
                />
                <input
                  required={formData.createAccount}
                  onChange={onChangeHandler}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword || ""}
                  className="border border-gray-500 rounded py-1.5 px-3.5 w-full"
                  autoComplete="new-password"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal taxRate={taxRate} />
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
