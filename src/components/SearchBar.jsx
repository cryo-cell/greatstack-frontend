import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";
function SearchBar() {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  if (!showSearch || !visible) return null;

  return (
    <div className="border-t border-b bg-gray-50 text-center py-4">
      <div className="relative mx-auto w-11/12 sm:w-2/3 md:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <img
          src={assets.search_icon}
          alt="Search"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-60"
        />
        <button
          onClick={() => setShowSearch(false)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-60 hover:opacity-100"
        >
          <X size={20} />{" "}
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
