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
  addIfPresent(qf, 'categoryName', params.categoryName);
  addIfPresent(qf, 'isActive', params.isActive);
  addIfPresent(qf, 'parentCategoryUUID', params.parentCategoryUUID);
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

/** tekil kategori normalizasyonu */
const normalizeCategory = (c) => ({
  id: c.uuid,
  uuid: c.uuid,
  createdAt: c.createdAt ?? null,
  updatedAt: c.updatedAt ?? null,

  name: c.name ?? '',
  description: c.description ?? '',
  
  isActive: Boolean(c.isActive),
  isDeleted: Boolean(c.isDeleted),

  parentCategoryUUID: c.parentCategoryUUID ?? null,
  childCategories: Array.isArray(c.childCategories) 
    ? c.childCategories.map(normalizeCategory) 
    : [],
});

/** response -> normalize { items, page, size, totalElements, ... } */
const normalizeListResponse = (json) => {
  // beklenen json.success, json.data.content vs.
  const data = json?.data ?? {};
  const content = Array.isArray(data.content) ? data.content : [];

  return {
    success: Boolean(json?.success),
    message: json?.message ?? '',
    statusCode: Number(json?.statusCode ?? 0),
    code: Number(json?.code ?? 0),
    timestamp: json?.timestamp ?? null,

    items: content.map(normalizeCategory),

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
 * Kategorileri getirir.
 * Dönen değer normalize edilmiş bir obje:
 * {
 *   items: NormalizedCategory[],
 *   page, size, totalElements, totalPages, first, last, hasNext, hasPrevious,
 *   success, message, statusCode, code, timestamp
 * }
 */
export const fetchCategories = async (params = {}) => {
  try {
    const pageRequest = buildPageRequest(params);
    
    // Desteklenmeyen filtreleri temizle (tarih filtreleri vs.)
    const cleanParams = {
      categoryName: params.categoryName,
      isActive: params.isActive,
      parentCategoryUUID: params.parentCategoryUUID
    };

    // Header'ları her çağrıda yeniden al
    const headers = getAuthHeaders();
    
    if (!headers.Authorization) {
      console.error('No authorization header found!');
      throw new Error('Yetkilendirme hatası. Lütfen tekrar giriş yapın.');
    }

    // Tüm çağrılar için query parametreleriyle filtreleme kullan
    // Filtered endpoint 401 hatası verdiği için GET endpoint'ini kullanıyoruz
    const qp = new URLSearchParams();
    qp.append('page', String(pageRequest.page));
    qp.append('size', String(pageRequest.size));
    qp.append('sortBy', pageRequest.sortBy);
    qp.append('sortDirection', pageRequest.sortDirection);
    qp.append('paginated', String(pageRequest.paginated));
    
    // Query parametreleriyle filtreleme
    if (cleanParams.categoryName) {
      qp.append('categoryName', cleanParams.categoryName);
    }
    if (cleanParams.isActive !== undefined && cleanParams.isActive !== null) {
      qp.append('isActive', String(cleanParams.isActive));
    }
    if (cleanParams.parentCategoryUUID) {
      qp.append('parentCategoryUUID', cleanParams.parentCategoryUUID);
    }

    const url = `${API_BASE_URL}/product/category/get-all?${qp.toString()}`;
    console.log('Category fetch URL:', url);
    console.log('Category fetch headers:', headers);
    
    const resp = await fetch(url, { 
      method: 'GET', 
      headers: {
        ...headers,
        'Accept': 'application/json',
      }
    });

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    const json = await resp.json();
    return normalizeListResponse(json);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Kategori detayını getirir
 */
export const fetchCategoryDetail = async (uuid) => {
  const headers = getAuthHeaders();
  
  try {
    const url = `${API_BASE_URL}/product/category/detail/${uuid}`;
    const resp = await fetch(url, { method: 'GET', headers });

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    const json = await resp.json();
    
    return {
      success: Boolean(json?.success),
      message: json?.message ?? '',
      category: json?.data?.category ? normalizeCategory(json.data.category) : null,
    };
  } catch (error) {
    console.error('Error fetching category detail:', error);
    throw error;
  }
};

/**
 * Yeni kategori oluşturur
 */
export const createCategory = async (data) => {
  const headers = getAuthHeaders();

  try {
    const url = `${API_BASE_URL}/product/category/add`;
    
    const body = {
      name: data.name || '',
      description: data.description || null,
    };
    
    if (data.parentUUID && data.parentUUID !== '' && data.parentUUID !== 'null') {
      body.parentUUID = data.parentUUID;
    }

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
      } catch (e) {
        console.error('Error response text:', errorText);
      }
      throw new Error(errorMessage);
    }
    
    const json = await resp.json();

    return {
      success: Boolean(json?.success),
      message: json?.message ?? '',
      category: json?.data?.category ? normalizeCategory(json.data.category) : (json?.data ? normalizeCategory(json.data) : null),
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Kategori günceller
 */
export const updateCategory = async (uuid, data) => {
  const headers = getAuthHeaders();

  try {
    const url = `${API_BASE_URL}/product/category/update/${uuid}`;
    
    const body = {
      name: data.name || '',
      description: data.description || null,
    };
    
    if (data.parentUUID && data.parentUUID !== '' && data.parentUUID !== 'null') {
      body.parentUUID = data.parentUUID;
    }

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
      } catch (e) {
        console.error('Error response text:', errorText);
      }
      throw new Error(errorMessage);
    }
    
    const json = await resp.json();

    return {
      success: Boolean(json?.success),
      message: json?.message ?? '',
      category: json?.data?.category ? normalizeCategory(json.data.category) : (json?.data ? normalizeCategory(json.data) : null),
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Kategori siler
 */
export const deleteCategory = async (uuid) => {
  const headers = getAuthHeaders();

  try {
    const url = `${API_BASE_URL}/product/category/delete/${uuid}`;
    const resp = await fetch(url, { method: 'DELETE', headers });

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    const json = await resp.json();

    return {
      success: Boolean(json?.success),
      message: json?.message ?? '',
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

/* ---------------------------- namespace --------------------------- */

const categoryApi = { 
  fetchCategories, 
  fetchCategoryDetail, 
  createCategory, 
  updateCategory, 
  deleteCategory 
};
export default categoryApi;

