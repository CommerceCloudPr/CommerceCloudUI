'use client'

const API_BASE_URL = 'https://api-dev.aykutcandan.com';

/**
 * Get authorization headers with session token
 */
const getAuthHeaders = () => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return {
      'Content-Type': 'application/json'
    };
  }
  
  const session = localStorage.getItem('session_token');
  
  // Check if session exists and is not null/undefined
  if (!session) {
    console.warn('No session token found in localStorage');
    return {
      'Content-Type': 'application/json'
    };
  }
  
  try {
    return {
      'Authorization': `Bearer ${decodeURIComponent(session)}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('Error decoding session token:', error);
    return {
      'Content-Type': 'application/json'
    };
  }
};

export const fetchProducts = async (params = {}) => {
  try {
    const session = localStorage.getItem('session_token');
    const headers = {
      'Authorization': `Bearer ${decodeURIComponent(session)}`,
      'Content-Type': 'application/json'
    };
    
    const hasFilters = params.productName || params.category || params.minPrice || params.maxPrice || 
                      params.stockStatus || params.minRating;
    
    let response;
    
    if (hasFilters) {
      // Filtered products endpoint (assuming similar structure to users)
      const url = `${API_BASE_URL}/product/get-all/filtered`;
      const requestBody = {
        pageRequest: {
          page: params.page || 0,
          size: params.size || 10,
          sortBy: params.sortBy || 'createdAt',
          sortDirection: params.sortDirection || 'ASC',
          paginated: params.paginated !== undefined ? params.paginated : true
        },
        queryFilter: {}
      };
      
      if (params.productName) requestBody.queryFilter.productName = params.productName;
      if (params.category) requestBody.queryFilter.category = params.category;
      if (params.minPrice) requestBody.queryFilter.minPrice = params.minPrice;
      if (params.maxPrice) requestBody.queryFilter.maxPrice = params.maxPrice;
      if (params.stockStatus) requestBody.queryFilter.stockStatus = params.stockStatus;
      if (params.minRating) requestBody.queryFilter.minRating = params.minRating;
      
      response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });
    } else {
      // Get all products
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.paginated !== undefined) queryParams.append('paginated', params.paginated);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/product/get-all${queryString ? `?${queryString}` : ''}`;
      
      response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Default export - Product List API functions
 */
const productApi = {
  fetchProducts
};

export default productApi;
