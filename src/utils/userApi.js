'use client'

const API_BASE_URL = 'http://api-dev.aykutcandan.com';

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

const buildQueryParams = (params) => {
  const queryParams = new URLSearchParams();
  
  // Add pagination parameters
  if (params.page !== undefined) queryParams.append('page', params.page);
  if (params.size !== undefined) queryParams.append('size', params.size);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
  if (params.paginated !== undefined) queryParams.append('paginated', params.paginated);
  
  // Add filter parameters
  if (params.firstName) queryParams.append('firstName', params.firstName);
  if (params.lastName) queryParams.append('lastName', params.lastName);
  if (params.username) queryParams.append('username', params.username);
  if (params.email) queryParams.append('email', params.email);
  if (params.enabled !== undefined) queryParams.append('enabled', params.enabled);
  if (params.lastLoginAt) queryParams.append('lastLoginAt', params.lastLoginAt);
  if (params.smsPermission !== undefined) queryParams.append('smsPermission', params.smsPermission);
  if (params.emailPermission !== undefined) queryParams.append('emailPermission', params.emailPermission);
  if (params.agreementAccepted !== undefined) queryParams.append('agreementAccepted', params.agreementAccepted);
  if (params.userDetailEntity_phoneNumber) queryParams.append('userDetailEntity_phoneNumber', params.userDetailEntity_phoneNumber);
  if (params.userDetailEntity_birthDate) queryParams.append('userDetailEntity_birthDate', params.userDetailEntity_birthDate);
  
  return queryParams.toString();
};

export const fetchUsers = async (params = {}) => {
  try {
    const session = localStorage.getItem('session_token');
    const headers = {
      'Authorization': `Bearer ${decodeURIComponent(session)}`,
      'Content-Type': 'application/json'
    };
    
    const hasFilters = params.firstName || params.lastName || params.username || params.email || 
                      params.enabled !== undefined || params.smsPermission !== undefined || 
                      params.emailPermission !== undefined || params.agreementAccepted !== undefined ||
                      params.userDetailEntity_phoneNumber || params.userDetailEntity_birthDate || 
                      params.lastLoginAt;
    
    let response;
    
    if (hasFilters) {
      const url = `${API_BASE_URL}/user/info/get-all/filtered`;
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
      
      if (params.firstName) requestBody.queryFilter.firstName = params.firstName;
      if (params.lastName) requestBody.queryFilter.lastName = params.lastName;
      if (params.username) requestBody.queryFilter.username = params.username;
      if (params.email) requestBody.queryFilter.email = params.email;
      if (params.enabled !== undefined) requestBody.queryFilter.enabled = params.enabled;
      if (params.smsPermission !== undefined) requestBody.queryFilter.smsPermission = params.smsPermission;
      if (params.emailPermission !== undefined) requestBody.queryFilter.emailPermission = params.emailPermission;
      if (params.agreementAccepted !== undefined) requestBody.queryFilter.agreementAccepted = params.agreementAccepted;
      if (params.userDetailEntity_phoneNumber) requestBody.queryFilter.userDetailEntity_phoneNumber = params.userDetailEntity_phoneNumber;
      if (params.userDetailEntity_birthDate) requestBody.queryFilter.userDetailEntity_birthDate = params.userDetailEntity_birthDate;
      if (params.lastLoginAt) requestBody.queryFilter.lastLoginAt = params.lastLoginAt;
      
      response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });
    } else {
      // Get all users
      const queryString = buildQueryParams(params);
      const url = `${API_BASE_URL}/user/info/get-all${queryString ? `?${queryString}` : ''}`;
      
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
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Default export - User List API functions only
 */
const userApi = {
  fetchUsers
};

export default userApi;
