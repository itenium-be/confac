const isDev = import.meta.env.MODE === 'development';

export const baseUrl = isDev ? 'http://localhost:9000' : window.location.origin;
export const backend = `${baseUrl}/api`;

export default {backend, baseUrl};
