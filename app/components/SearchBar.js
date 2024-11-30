"use client";
import React from "react";

/**
 * Renders a search bar component with input field and action buttons
 * @param {string} searchQuery - The current search query value
 * @param {function} setSearchQuery - Function to update the search query
 * @param {function} onAddClick - Function to handle adding a new item
 * @param {function} onSortClick - Function to handle sorting items
 * @returns {JSX.Element} A div containing search input and action buttons
 */
const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onAddClick,
  onSortClick,
}) => {
  return (
    <div className="w-full mb-4 flex flex-col items-center justify-center">
      <input
        type="text"
        placeholder="Search items..."
        className="border border-[#10423e] bg-white text-[#10423e] placeholder:text-gray-500 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#408d86] focus:border-transparent w-11/12 md:w-1/2 lg:w-1/3 mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="flex justify-center gap-4">
        <button
          className="bg-[#408d86] text-white p-3 rounded-lg hover:bg-[#306d6b]"
          onClick={onAddClick}
        >
          Add New Item
        </button>
        <button
          className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600"
          onClick={onSortClick}
        >
          Sort Items
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
