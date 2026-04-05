import axios from 'axios';

let requestInterceptor

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

export const setupInterceptors = (accessToken, setAccessToken) => {
    if (requestInterceptor !== undefined) {
        api.interceptors.request.eject(requestInterceptor);
    }

    // 2. Add the new one with the current token
    requestInterceptor = api.interceptors.request.use((config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });
    api.interceptors.request.use((config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            //  Blob errors (CSV download case)
            if (error.response?.data instanceof Blob && error.response.data.type === "application/json") {
                const text = await error.response.data.text();
                error.response.data = JSON.parse(text);
            }
            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return api(originalRequest);
                        })
                        .catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/refresh`, {}, { withCredentials: true });

                    const newAccessToken = res.data.accessToken;

                    if (!newAccessToken) {
                        throw new Error("No access token returned");
                    }

                    setAccessToken(newAccessToken);
                    processQueue(null, newAccessToken);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    setAccessToken(null);
                    window.location.href = "/";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            if (error.response?.status === 403) {
                setAccessToken(null);
            }

            return Promise.reject(error);
        }
    );
};

export default api;