import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/auth/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                const now = Math.ceil(Date.now() / 1000);
                if (tokenParts.exp > now) {
                    return axiosInstance
                        .post('jwt/refresh/', { refresh: refreshToken })
                        .then((response) => {
                            localStorage.setItem('access_token', response.data.access);
                            axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
                            originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;

                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log('Refresh token is expired', tokenParts.exp, now);
                }
            } else {
                console.log('Refresh token not available.');
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
