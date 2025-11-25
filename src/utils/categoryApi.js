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
  const headers = getAuthHeaders();

  try {
    const pageRequest = buildPageRequest(params);

    // filtreli çağrı
    if (hasAnyFilter(params)) {
      const url = `${API_BASE_URL}/product/category/get-all/filtered`;
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

    const url = `${API_BASE_URL}/product/category/get-all?${qp.toString()}`;
    const resp = await fetch(url, { method: 'GET', headers });

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

/* ---------------------------- namespace --------------------------- */

const categoryApi = { fetchCategories, fetchCategoryDetail };
export default categoryApi;

