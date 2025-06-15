import React from "react";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";
import Title from "./Title";

const CartTotal = ({ taxRate }) => {
  const { currency, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="w-full">
      <Title text1={"CART"} text2={"TOTAL"} />

      <div className="border p-4">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>
          Tax ({(taxRate * 100).toFixed(2)}%): ${tax.toFixed(2)}
        </p>
        <p className="font-bold mt-2">Total: ${total.toFixed(2)}</p>
      </div>
      <div className="text-2xl"></div>
    </div>
  );
};

export default CartTotal;
