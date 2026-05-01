import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";

const AutocompleteSelect = ({ 
  apiEndpoint, 
  placeholder, 
  value, 
  onChange, 
  displayField = "name",
  valueField = "id",
  debounceMs = 300,
  selectedObject
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm || isOpen) {
        fetchOptions(searchTerm);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  // Set selected option when value changes
  useEffect(() => {
    if (value && options.length > 0) {
      const selected = options.find(option => option[valueField] === value);
      if (selected) {
        setSelectedOption(selected);
      }
    }
  }, [value, options, valueField]);

  const fetchOptions = async (search = "") => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      const response = await axios.get(apiEndpoint, { params });
      if (response.data?.status === "SUCCESS" && response.data?.data) {
        setOptions(response.data.data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      setOptions([]);
    }
    setLoading(false);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option[valueField]);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (options.length === 0) {
      fetchOptions();
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={
            selectedOption
              ? selectedOption[displayField]
              : selectedObject && !searchTerm
                ? selectedObject[displayField]
                : placeholder
          }
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pr-8"
        />
        <ChevronDown 
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              Loading...
            </div>
          ) : options.length > 0 ? (
            options.map((option) => (
              <div
                key={option[valueField]}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(option)}
              >
                {option[displayField]}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              {searchTerm ? "No results found" : "Start typing to search..."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSelect;