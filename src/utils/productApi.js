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
  addIfPresent(qf, 'productName', params.productName);
  addIfPresent(qf, 'category', params.category);
  addIfPresent(qf, 'minPrice', params.minPrice);
  addIfPresent(qf, 'maxPrice', params.maxPrice);
  addIfPresent(qf, 'stockStatus', params.stockStatus);
  addIfPresent(qf, 'minRating', params.minRating);
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

/** güvenli görsel url (blob veya http/https), yoksa null döndür */
const normalizeImageUrls = (list) => {
  if (!Array.isArray(list)) return [];
  return list
    .filter(Boolean)
    .map(String)
    .filter(u => u.startsWith('http://') || u.startsWith('https://') || u.startsWith('blob:'));
};

/** tekil ürün normalizasyonu */
const normalizeProduct = (p) => ({
  id: p.uuid,
  createdAt: p.createdAt ?? null,
  updatedAt: p.updatedAt ?? null,

  name: p.productName ?? '',
  sku: p.productSku ?? '',
  description: p.productDescription ?? '',
  shortDescription: p.productShortDescription ?? '',

  originalPrice: Number(p.originalPrice ?? 0),
  sellPrice: Number(p.sellPrice ?? 0),
  effectivePrice: Number(p.effectivePrice ?? 0),

  originalPriceInclVat: Number(p.originalPriceInclVat ?? 0),
  sellPriceInclVat: Number(p.sellPriceInclVat ?? 0),
  effectivePriceIncVat: Number(p.effectivePriceIncVat ?? 0),
  vatAmount: Number(p.vatAmount ?? 0),
  vatRate: Number(p.vatRate ?? 0),

  discountAmount: Number(p.discountAmount ?? 0),
  discountPercentage: Number(p.discountPercentage ?? 0),
  hasDiscount: Boolean(p.hasDiscount),

  totalStock: Number(p.totalStock ?? 0),
  barcode: p.productBarcode ?? '',

  images: normalizeImageUrls(p.productImageUrlList),

  isActive: Boolean(p.isActive),
  isDeleted: Boolean(p.isDeleted),
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

    items: content.map(normalizeProduct),

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
 * Ürünleri getirir.
 * Dönen değer normalize edilmiş bir obje:
 * {
 *   items: NormalizedProduct[],
 *   page, size, totalElements, totalPages, first, last, hasNext, hasPrevious,
 *   success, message, statusCode, code, timestamp
 * }
 */
export const fetchProducts = async (params = {}) => {
  const headers = getAuthHeaders();

  try {
    const pageRequest = buildPageRequest(params);

    // filtreli çağrı
    if (hasAnyFilter(params)) {
      const url = `${API_BASE_URL}/product/get-all/filtered`;
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

    const url = `${API_BASE_URL}/product/get-all?${qp.toString()}`;
    const resp = await fetch(url, { method: 'GET', headers });

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    const json = await resp.json();
    return normalizeListResponse(json);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/* ---------------------------- namespace --------------------------- */

const productApi = { fetchProducts };
export default productApi;