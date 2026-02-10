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

/**
 * Fetch all orders with optional filtering
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise<Object>} Orders data
 */
export const fetchOrders = async (params = {}) => {
  try {
    const headers = getAuthHeaders();
    
    const hasFilters = params.searchQuery || params.status || params.paymentType || 
                      params.cargo || params.source || params.dateFrom || params.dateTo;
    
    let response;
    
    if (hasFilters) {
      // Filtered orders endpoint
      const url = `${API_BASE_URL}/order/get-all/filtered`;
      const requestBody = {
        pageRequest: {
          page: params.page || 0,
          size: params.size || 10,
          sortBy: params.sortBy || 'createdAt',
          sortDirection: params.sortDirection || 'DESC',
          paginated: params.paginated !== undefined ? params.paginated : true
        },
        queryFilter: {}
      };
      
      if (params.searchQuery) requestBody.queryFilter.searchQuery = params.searchQuery;
      if (params.status) requestBody.queryFilter.status = params.status;
      if (params.paymentType) requestBody.queryFilter.paymentType = params.paymentType;
      if (params.cargo) requestBody.queryFilter.cargo = params.cargo;
      if (params.source) requestBody.queryFilter.source = params.source;
      if (params.dateFrom) requestBody.queryFilter.dateFrom = params.dateFrom;
      if (params.dateTo) requestBody.queryFilter.dateTo = params.dateTo;
      
      response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });
    } else {
      // Get all orders
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.paginated !== undefined) queryParams.append('paginated', params.paginated);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/order/get-all${queryString ? `?${queryString}` : ''}`;
      
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
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Fetch single order by ID
 * @param {string|number} orderId - Order ID
 * @returns {Promise<Object>} Order data
 */
export const fetchOrderById = async (orderId) => {
  try {
    const headers = getAuthHeaders();
    const url = `${API_BASE_URL}/order/get/${orderId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Create new order
 * @param {Object} orderData - Order data to create
 * @returns {Promise<Object>} Created order data
 */
export const createOrder = async (orderData) => {
  try {
    const headers = getAuthHeaders();
    const url = `${API_BASE_URL}/order/create`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update order
 * @param {string|number} orderId - Order ID
 * @param {Object} orderData - Order data to update
 * @returns {Promise<Object>} Updated order data
 */
export const updateOrder = async (orderId, orderData) => {
  try {
    const headers = getAuthHeaders();
    const url = `${API_BASE_URL}/order/update/${orderId}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string|number} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order data
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const headers = getAuthHeaders();
    const url = `${API_BASE_URL}/order/update-status/${orderId}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Delete order
 * @param {string|number} orderId - Order ID
 * @returns {Promise<Object>} Response data
 */
export const deleteOrder = async (orderId) => {
  try {
    const headers = getAuthHeaders();
    const url = `${API_BASE_URL}/order/delete/${orderId}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

/**
 * Get order statistics
 * @returns {Promise<Object>} Order statistics data
 */
export const fetchOrderStatistics = async () => {
  try {
    const headers = getAuthHeaders();
    const url = `${API_BASE_URL}/order/statistics`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw error;
  }
};

/**
 * Export orders to Excel
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Blob>} Excel file blob
 */
export const exportOrdersToExcel = async (filters = {}) => {
  try {
    const headers = getAuthHeaders();
    const url = `${API_BASE_URL}/order/export/excel`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(filters)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error exporting orders:', error);
    throw error;
  }
};

/**
 * Default export - Order API functions
 */
const orderApi = {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  fetchOrderStatistics,
  exportOrdersToExcel
};

export default orderApi;
