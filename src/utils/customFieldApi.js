'use client'

const API_BASE_URL = 'https://api-dev.aykutcandan.com';

/* ----------------------------- helpers ----------------------------- */

const isBrowser = () => typeof window !== 'undefined';

const getAuthHeaders = () => {
  const base = { 'Content-Type': 'application/json' };
  if (!isBrowser()) return base;

  const raw = localStorage.getItem('session_token');
  if (!raw) return base;

  try {
    return { ...base, Authorization: `Bearer ${decodeURIComponent(raw)}` };
  } catch (e) {
    console.error('Error decoding session token:', e);
    return base;
  }
};

/** boş string hariç tüm değerleri kabul (0/false dahil) */
const addIfPresent = (obj, key, val) => {
  if (val !== undefined && val !== null && val !== '') obj[key] = val;
};

const buildQueryFilter = (params = {}) => {
  const qf = {};
  addIfPresent(qf, 'fieldName', params.fieldName);
  addIfPresent(qf, 'fieldType', params.fieldType);
  addIfPresent(qf, 'entityType', params.entityType);
  addIfPresent(qf, 'isActive', params.isActive);
  addIfPresent(qf, 'isRequired', params.isRequired);
  return qf;
};

const buildPageRequest = (params = {}) => ({
  page: params.page ?? 0,
  size: params.size ?? 10,
  sortBy: params.sortBy ?? 'createdAt',
  sortDirection: params.sortDirection ?? 'ASC',
  paginated: params.paginated ?? true,
});

const hasAnyFilter = (params = {}) => Object.keys(buildQueryFilter(params)).length > 0;

/** tekil custom field normalizasyonu */
const normalizeCustomField = (cf) => ({
  id: cf.uuid,
  uuid: cf.uuid,
  createdAt: cf.createdAt ?? null,
  updatedAt: cf.updatedAt ?? null,

  // Backend'den gelen field'lar: name ve code
  name: cf.name ?? cf.fieldName ?? '',
  code: cf.code ?? '',
  label: cf.label ?? cf.fieldLabel ?? cf.name ?? '',
  type: cf.fieldType ?? cf.type ?? 'text',
  entityType: cf.entityType ?? 'product',
  
  placeholder: cf.placeholder ?? '',
  defaultValue: cf.defaultValue ?? '',
  options: cf.options ?? [],
  
  isRequired: Boolean(cf.isRequired),
  isActive: Boolean(cf.isActive),
  isDeleted: Boolean(cf.isDeleted),
  
  sortOrder: Number(cf.sortOrder ?? 0),
  
  // validation kuralları
  minLength: cf.minLength ?? null,
  maxLength: cf.maxLength ?? null,
  minValue: cf.minValue ?? null,
  maxValue: cf.maxValue ?? null,
  pattern: cf.pattern ?? null,
});

/** response -> normalize { items, page, size, totalElements, ... } */
const normalizeListResponse = (json) => {
  const data = json?.data ?? {};
  const content = Array.isArray(data.content) ? data.content : [];

  return {
    success: Boolean(json?.success),
    message: json?.message ?? '',
    statusCode: Number(json?.statusCode ?? 0),
    code: Number(json?.code ?? 0),
    timestamp: json?.timestamp ?? null,

    items: content.map(normalizeCustomField),

    page: Number(data.page ?? 0),
    size: Number(data.size ?? content.length ?? 0),
    totalElements: Number(data.totalElements ?? content.length ?? 0),
    totalPages: Number(data.totalPages ?? 1),
    first: Boolean(data.first ?? true),
    last: Boolean(data.last ?? true),
    hasNext: Boolean(data.hasNext ?? false),
    hasPrevious: Boolean(data.hasPrevious ?? false),
  };
};

/* ------------------------------ API ------------------------------- */

/**
 * Custom Field listesini getirir.
 */
export const fetchCustomFields = async (params = {}) => {
  const headers = getAuthHeaders();

  try {
    const pageRequest = buildPageRequest(params);

    // filtreli çağrı
    if (hasAnyFilter(params)) {
      const url = `${API_BASE_URL}/product/custom-fields/get-all/filtered`;
      const body = { pageRequest, queryFilter: buildQueryFilter(params) };

      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      const json = await resp.json();
      return normalizeListResponse(json);
    }

    // filtresiz çağrı
    const qp = new URLSearchParams();
    qp.append('page', String(pageRequest.page));
    qp.append('size', String(pageRequest.size));
    qp.append('sortBy', pageRequest.sortBy);
    qp.append('sortDirection', pageRequest.sortDirection);
    qp.append('paginated', String(pageRequest.paginated));

    const url = `${API_BASE_URL}/product/custom-fields/get-all?${qp.toString()}`;
    const resp = await fetch(url, { method: 'GET', headers });

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    const json = await resp.json();
    return normalizeListResponse(json);
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    throw error;
  }
};

/**
 * Custom Field detayını getirir.
 */
export const fetchCustomFieldDetail = async (uuid) => {
  const headers = getAuthHeaders();

  try {
    const url = `${API_BASE_URL}/product/custom-fields/detail/${uuid}`;
    const resp = await fetch(url, { method: 'GET', headers });

    if (!resp.ok) {
      const errorText = await resp.text();
      let errorMessage = `HTTP error! status: ${resp.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
        console.error('Backend error response:', errorJson);
      } catch (e) {
        console.error('Error response text:', errorText);
      }
      throw new Error(errorMessage);
    }
    
    const json = await resp.json();

    return {
      success: Boolean(json?.success),
      message: json?.message ?? '',
      customField: json?.data?.customField ? normalizeCustomField(json.data.customField) : (json?.data ? normalizeCustomField(json.data) : null),
    };
  } catch (error) {
    console.error('Error fetching custom field detail:', error);
    throw error;
  }
};

/**
 * Yeni Custom Field oluşturur.
 */
export const createCustomField = async (data) => {
  const headers = getAuthHeaders();

  try {
    const url = `${API_BASE_URL}/product/custom-fields/add`;
    
    // Request body'yi oluştur - backend name ve code bekliyor (required)
    const body = {
      name: data.name || '', // name required - field name
      code: data.name || '', // code required - genelde name ile aynı veya unique code
      fieldType: data.type || 'text',
      entityType: data.entityType || 'product',
      isRequired: Boolean(data.isRequired),
      isActive: data.isActive !== false,
    };
    
    // Optional fields
    if (data.label) body.label = data.label;
    if (data.placeholder) body.placeholder = data.placeholder;
    if (data.defaultValue) body.defaultValue = data.defaultValue;
    if (data.options && Array.isArray(data.options) && data.options.length > 0) {
      body.options = data.options;
    }
    if (data.sortOrder !== undefined) body.sortOrder = Number(data.sortOrder);
    if (data.minLength !== undefined && data.minLength !== null) body.minLength = Number(data.minLength);
    if (data.maxLength !== undefined && data.maxLength !== null) body.maxLength = Number(data.maxLength);
    if (data.minValue !== undefined && data.minValue !== null) body.minValue = Number(data.minValue);
    if (data.maxValue !== undefined && data.maxValue !== null) body.maxValue = Number(data.maxValue);
    if (data.pattern) body.pattern = data.pattern;

    console.log('Creating custom field with body:', body);

    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      let errorMessage = `HTTP error! status: ${resp.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
        console.error('Backend error response:', errorJson);
      } catch (e) {
        console.error('Error response text:', errorText);
      }
      throw new Error(errorMessage);
    }
    
    const json = await resp.json();

    return {
      success: Boolean(json?.success),
      message: json?.message ?? '',
      customField: json?.data?.customField ? normalizeCustomField(json.data.customField) : (json?.data ? normalizeCustomField(json.data) : null),
    };
  } catch (error) {
    console.error('Error creating custom field:', error);
    throw error;
  }
};

/**
 * Custom Field günceller.
 */
export const updateCustomField = async (uuid, data) => {
  const headers = getAuthHeaders();

  try {
    const url = `${API_BASE_URL}/product/custom-fields/update/${uuid}`;
    
    // Request body'yi oluştur - backend name ve code bekliyor (required)
    const body = {
      name: data.name || '', // name required
      code: data.code || data.name || '', // code required - eğer code yoksa name kullan
      fieldType: data.type || 'text',
      entityType: data.entityType || 'product',
      isRequired: Boolean(data.isRequired),
      isActive: Boolean(data.isActive),
    };
    
    // Optional fields
    if (data.label) body.label = data.label;
    if (data.placeholder) body.placeholder = data.placeholder;
    if (data.defaultValue) body.defaultValue = data.defaultValue;
    if (data.options && Array.isArray(data.options) && data.options.length > 0) {
      body.options = data.options;
    }
    if (data.sortOrder !== undefined) body.sortOrder = Number(data.sortOrder);
    if (data.minLength !== undefined && data.minLength !== null) body.minLength = Number(data.minLength);
    if (data.maxLength !== undefined && data.maxLength !== null) body.maxLength = Number(data.maxLength);
    if (data.minValue !== undefined && data.minValue !== null) body.minValue = Number(data.minValue);
    if (data.maxValue !== undefined && data.maxValue !== null) body.maxValue = Number(data.maxValue);
    if (data.pattern) body.pattern = data.pattern;

    console.log('Updating custom field with body:', body);

    const resp = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      let errorMessage = `HTTP error! status: ${resp.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
        console.error('Backend error response:', errorJson);
      } catch (e) {
        console.error('Error response text:', errorText);
      }
      throw new Error(errorMessage);
    }
    const json = await resp.json();

    return {
      success: Boolean(json?.success),
      message: json?.message ?? '',
      customField: json?.data?.customField ? normalizeCustomField(json.data.customField) : (json?.data ? normalizeCustomField(json.data) : null),
    };
  } catch (error) {
    console.error('Error updating custom field:', error);
    throw error;
  }
};

/**
 * Custom Field siler.
 */
export const deleteCustomField = async (uuid) => {
  const headers = getAuthHeaders();

  try {
    const url = `${API_BASE_URL}/product/custom-fields/delete/${uuid}`;
    const resp = await fetch(url, { method: 'DELETE', headers });

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    const json = await resp.json();

    return {
      success: Boolean(json?.success),
      message: json?.message ?? '',
    };
  } catch (error) {
    console.error('Error deleting custom field:', error);
    throw error;
  }
};

/**
 * Custom Field durumunu değiştirir (aktif/pasif).
 */
export const toggleCustomFieldStatus = async (uuid, isActive) => {
  const headers = getAuthHeaders();

  try {
    const url = `${API_BASE_URL}/product/custom-fields/toggle-status/${uuid}`;
    const resp = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ isActive }),
    });

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    const json = await resp.json();

    return {
      success: Boolean(json?.success),
      message: json?.message ?? '',
    };
  } catch (error) {
    console.error('Error toggling custom field status:', error);
    throw error;
  }
};

/**
 * Belirli bir entity'ye ait custom field'ları getirir (product için).
 */
export const fetchCustomFieldsByEntity = async (entityType, params = {}) => {
  const headers = getAuthHeaders();

  try {
    const pageRequest = buildPageRequest(params);
    const url = `${API_BASE_URL}/product/custom-fields/get-by-entity/${entityType}`;
    
    const qp = new URLSearchParams();
    qp.append('page', String(pageRequest.page));
    qp.append('size', String(pageRequest.size));
    qp.append('sortBy', pageRequest.sortBy);
    qp.append('sortDirection', pageRequest.sortDirection);
    qp.append('paginated', String(pageRequest.paginated));

    const resp = await fetch(`${url}?${qp.toString()}`, { method: 'GET', headers });

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    const json = await resp.json();
    return normalizeListResponse(json);
  } catch (error) {
    console.error('Error fetching custom fields by entity:', error);
    throw error;
  }
};

/* ---------------------------- namespace --------------------------- */

const customFieldApi = {
  fetchCustomFields,
  fetchCustomFieldDetail,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  toggleCustomFieldStatus,
  fetchCustomFieldsByEntity,
};

export default customFieldApi;

