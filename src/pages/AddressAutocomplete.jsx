import React, { useState } from 'react';
import axios from 'axios';

const AddressAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const searchAddress = async (text) => {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: text,
        format: 'json',
        addressdetails: 1,
        limit: 5,
      },
      headers: { 'Accept-Language': 'en' }
    });
    setSuggestions(res.data);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 3) {
      searchAddress(value);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <input
        value={query}
        onChange={handleInputChange}
        placeholder="Enter your address"
        className="border px-3 py-2 w-full"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full z-10">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(s.display_name);
                setSuggestions([]);
                onSelect(s);
              }}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
