import axios from "./axios";

/**
 * Custom SWR fetcher that uses the project's axios instance
 * @param {string} url - The API endpoint URL
 * @param {object} params - Optional query parameters
 * @returns {Promise} - Returns the data from the API response
 */
export const swrFetcher = async (url, params = {}) => {
  const response = await axios.get(url, { params });
  return response?.data?.data || response?.data || [];
};

/**
 * Fetcher for count endpoints that returns the count value
 */
export const swrCountFetcher = async (url) => {
  const response = await axios.get(url);
  return response?.data?.data || response?.data || 0;
};
