import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddressAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef({});
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const savedCache = localStorage.getItem("autocompleteCache");
    if (savedCache) {
      try {
        cacheRef.current = JSON.parse(savedCache);
      } catch (e) {
        console.warn("Failed to parse cache from localStorage:", e);
      }
    }
  }, []);

  const searchAddress = async (searchTerm) => {
    if (!searchTerm) return;

    if (cacheRef.current[searchTerm]) {
      setSuggestions(cacheRef.current[searchTerm]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: searchTerm,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });

      const results = response.data;
      setSuggestions(results);
      cacheRef.current[searchTerm] = results;
      localStorage.setItem("autocompleteCache", JSON.stringify(cacheRef.current)); // persist cache
    } catch (error) {
      console.error("Autocomplete error:", error.message);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => searchAddress(val), 400);
  };

  const handleSelect = (item) => {
    onSelect(item);
    setQuery(item.display_name);
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter address"
        className="border rounded px-3 py-2 w-full"
      />
      {isLoading && <p className="text-sm">Searching...</p>}
      {suggestions.length > 0 && (
        <ul className="border mt-2 rounded max-h-48 overflow-y-auto">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
