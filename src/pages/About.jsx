import React from 'react'

  import { Rocket, Store, Wrench } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-bold text-center">About Meta Store</h1>

      <p className="text-lg text-gray-700 text-center">
        This demo isn’t just a showcase — it’s a working system. Built with real
        tools. Real data. Real potential.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 text-center mt-8">
        <div className="p-4 rounded-xl bg-gray-100 shadow-sm">
          <Store className="mx-auto mb-2 text-indigo-600" size={32} />
          <h3 className="font-semibold">Customizable Storefront</h3>
          <p className="text-sm text-gray-600">
            Built with flexibility in mind — styling, features, and structure
            adapt to your brand.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gray-100 shadow-sm">
          <Wrench className="mx-auto mb-2 text-green-600" size={32} />
          <h3 className="font-semibold">Full Admin Control</h3>
          <p className="text-sm text-gray-600">
            Add products, update orders, manage categories — all without touching
            the code.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gray-100 shadow-sm">
          <Rocket className="mx-auto mb-2 text-rose-600" size={32} />
          <h3 className="font-semibold">Launch-Ready</h3>
          <p className="text-sm text-gray-600">
            What you're seeing is deployable. Replace the content and you're live.
          </p>
        </div>
      </div>

      <p className="text-center text-gray-800 text-lg mt-10">
        Want a store like this? <span className="font-medium">Let’s build it.</span>
      </p>
    </div>
  );
}



