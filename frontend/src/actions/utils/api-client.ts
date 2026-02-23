import {buildUrl} from './buildUrl';
import {authService} from '../../components/users/authService';
import {socketService} from '../../components/socketio/SocketService';

export interface ApiResponse<T = unknown> {
  body: T;
  text: string;
  status: number;
  ok: boolean;
}

export interface ApiError {
  status: number;
  body?: {
    message?: string;
    data?: Record<string, string | number>;
    stack?: string;
    errors?: Array<{Code: string; Description?: string}>;
    error?: string;
  };
  message?: string;
  res: {
    badRequest: boolean;
    unauthorized: boolean;
    error?: string;
  };
}

type RequestOptions = {
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'text';
};

function getDefaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (authService.loggedIn()) {
    headers.Authorization = authService.getBearer();
  }

  if (socketService.socketId) {
    headers['x-socket-id'] = socketService.socketId;
  }

  return headers;
}

async function request<T = unknown>(
  method: string,
  url: string,
  data?: unknown,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const headers = {
    ...getDefaultHeaders(),
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (data !== undefined) {
    if (data instanceof FormData) {
      // Don't set Content-Type for FormData - browser sets it with boundary
      fetchOptions.body = data;
    } else {
      headers['Content-Type'] = 'application/json';
      fetchOptions.headers = headers;
      fetchOptions.body = JSON.stringify(data);
    }
  }

  const response = await fetch(buildUrl(url), fetchOptions);

  let body: T;
  let text = '';

  if (options.responseType === 'blob') {
    body = await response.blob() as T;
  } else if (options.responseType === 'text') {
    text = await response.text();
    body = text as T;
  } else {
    text = await response.text();
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text as T;
    }
  }

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      body: typeof body === 'object' ? body as ApiError['body'] : undefined,
      message: typeof body === 'object' && body !== null && 'message' in body
        ? (body as {message?: string}).message
        : text,
      res: {
        badRequest: response.status === 400,
        unauthorized: response.status === 401,
        error: text,
      },
    };
    throw error;
  }

  return {
    body,
    text,
    status: response.status,
    ok: response.ok,
  };
}

export const api = {
  get: <T = unknown>(url: string, options?: RequestOptions) =>
    request<T>('GET', url, undefined, options),

  post: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>('POST', url, data, options),

  put: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>('PUT', url, data, options),

  patch: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', url, data, options),

  delete: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>('DELETE', url, data, options),

  /**
   * Upload a file using FormData
   */
  upload: <T = unknown>(url: string, fieldName: string, file: File, options?: RequestOptions) => {
    const formData = new FormData();
    formData.append(fieldName, file);
    return request<T>('PUT', url, formData, options);
  },
};
