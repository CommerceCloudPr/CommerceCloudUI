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
    addIfPresent(qf, 'attributeName', params.attributeName);
    addIfPresent(qf, 'attributeType', params.attributeType);
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


/** tekil ürün normalizasyonu */
const normalizeAttribute = (p) => ({
    id: p.uuid,
    createDate: p.createdAt ?? null,
    updateDate: p.updatedAt ?? null,
    name: p.attributeName ?? '',
    type: p.attributeType ?? '',
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
        items: content.map(normalizeAttribute),
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
export const fetchAttributes = async (params = {}) => {
    const headers = getAuthHeaders();

    try {
        const pageRequest = buildPageRequest(params);

        // filtreli çağrı
        if (hasAnyFilter(params)) {
            const url = `${API_BASE_URL}/product/attributes-definitions/filtered`;
            const body = { pageRequest, queryFilter: buildQueryFilter(params) };

            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!resp.ok) {
                const errorText = await resp.text();
                console.error('Attribute fetch error response:', errorText);
                if (resp.status === 401) {
                    throw new Error('Yetkilendirme hatası. Lütfen tekrar giriş yapın.');
                }
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
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

        const url = `${API_BASE_URL}/product/attributes-definitions/get-all?${qp.toString()}`;
        const resp = await fetch(url, { 
            method: 'GET', 
            headers: {
                ...headers,
                'Accept': 'application/json',
            }
        });

        if (!resp.ok) {
            const errorText = await resp.text();
            console.error('Attribute fetch error response:', errorText);
            if (resp.status === 401) {
                throw new Error('Yetkilendirme hatası. Lütfen tekrar giriş yapın.');
            }
            throw new Error(`HTTP error! status: ${resp.status}`);
        }
        const json = await resp.json();
        return normalizeListResponse(json);
    } catch (error) {
        console.error('Error fetching attributes:', error);
        throw error;
    }
};

/**
 * Attribute detayını getirir.
 */
export const fetchAttributeDetail = async (uuid) => {
    const headers = getAuthHeaders();

    try {
        const url = `${API_BASE_URL}/product/attributes-definitions/get/${uuid}`;
        const resp = await fetch(url, { 
            method: 'GET', 
            headers: {
                ...headers,
                'Accept': 'application/json',
            }
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
        const data = json?.data || json?.data?.attributeDefinition || json;

        return {
            success: Boolean(json?.success),
            message: json?.message ?? '',
            attribute: normalizeAttribute(data),
        };
    } catch (error) {
        console.error('Error fetching attribute detail:', error);
        throw error;
    }
};

/**
 * Yeni Attribute oluşturur.
 */
export const createAttribute = async (data) => {
    const headers = getAuthHeaders();

    try {
        const url = `${API_BASE_URL}/product/attributes-definitions/add`;
        
        const body = {
            attributeName: data.attributeName || data.name || '',
            attributeType: data.attributeType || data.type || 'TEXT',
        };

        console.log('Creating attribute with body:', body);

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                ...headers,
                'Accept': 'application/json',
            },
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
        const responseData = json?.data || json?.data?.attributeDefinition || json;

        return {
            success: Boolean(json?.success),
            message: json?.message ?? '',
            attribute: normalizeAttribute(responseData),
        };
    } catch (error) {
        console.error('Error creating attribute:', error);
        throw error;
    }
};

/**
 * Attribute günceller.
 */
export const updateAttribute = async (uuid, data) => {
    const headers = getAuthHeaders();

    try {
        const url = `${API_BASE_URL}/product/attributes-definitions/update/${uuid}`;
        
        const body = {
            attributeName: data.attributeName || data.name || '',
            attributeType: data.attributeType || data.type || 'TEXT',
        };

        console.log('Updating attribute with body:', body);

        const resp = await fetch(url, {
            method: 'PUT',
            headers: {
                ...headers,
                'Accept': 'application/json',
            },
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
        const responseData = json?.data || json?.data?.attributeDefinition || json;

        return {
            success: Boolean(json?.success),
            message: json?.message ?? '',
            attribute: normalizeAttribute(responseData),
        };
    } catch (error) {
        console.error('Error updating attribute:', error);
        throw error;
    }
};

/**
 * Attribute siler.
 */
export const deleteAttribute = async (uuid) => {
    const headers = getAuthHeaders();

    try {
        const url = `${API_BASE_URL}/product/attributes-definitions/delete/${uuid}`;
        const resp = await fetch(url, { 
            method: 'DELETE', 
            headers: {
                ...headers,
                'Accept': 'application/json',
            }
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
        };
    } catch (error) {
        console.error('Error deleting attribute:', error);
        throw error;
    }
};

/* ---------------------------- namespace --------------------------- */

const attributeApi = { 
    fetchAttributes,
    fetchAttributeDetail,
    createAttribute,
    updateAttribute,
    deleteAttribute,
};
export default attributeApi;