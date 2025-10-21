"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";

export default function CityAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Wpisz miasto...",
  className = "",
  onSelect
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Update query when value prop changes
  useEffect(() => {
    if (value && value !== query) {
      setQuery(value);
    }
  }, [value]);

  // Debounce search
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchCities(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchCities = async (searchQuery) => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/hd/cities/autocomplete?query=${encodeURIComponent(searchQuery)}`);
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.cities || []);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error searching cities:", error);
      setSuggestions([]);
      // Show a message that autocomplete is not available
      setSuggestions([{
        display_name: "Autocomplete niedostępny - wpisz miasto ręcznie",
        city: "Autocomplete niedostępny",
        country: "",
        lat: 52.2297,
        lng: 21.0122,
        full_address: "Autocomplete niedostępny - wpisz miasto ręcznie",
        isError: true
      }]);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onChange(newQuery);
    setSelectedIndex(-1);
  };

  const handleSelect = (city) => {
    setQuery(city.display_name);
    onChange(city.display_name);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (onSelect) {
      onSelect({
        place: city.display_name,
        lat: city.lat,
        lng: city.lng
      });
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FABB46] focus:border-transparent transition-colors"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand"></div>
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((city, index) => (
            <button
              key={`${city.lat}-${city.lng}`}
              type="button"
              onClick={() => !city.isError && handleSelect(city)}
              className={`w-full px-4 py-3 text-left flex items-center space-x-3 ${
                city.isError 
                  ? "bg-red-50 text-red-600 cursor-default" 
                  : `hover:bg-gray-50 ${index === selectedIndex ? "bg-yellow-50 border-r-2 border-brand" : ""}`
              }`}
            >
              {city.isError ? (
                <span className="h-4 w-4 text-red-500 flex-shrink-0">⚠️</span>
              ) : (
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${city.isError ? "text-red-600" : "text-gray-900"}`}>
                  {city.city}
                </div>
                {!city.isError && (
                  <div className="text-sm text-gray-500 truncate">
                    {city.country}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && suggestions.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          Nie znaleziono miast dla "{query}"
        </div>
      )}
    </div>
  );
}
