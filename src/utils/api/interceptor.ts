const safeUrls = []

export const addAuthInterceptor = () => {
    const originalFetch = fetch;
    window.fetch = async (input, init) => {
        const token = localStorage.getItem('token');
        if (token) {
            if (!init) {
                init = {};
            }
            if (!init.headers) {
                init.headers = {};
            }
            (init.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
        return originalFetch(input, init);
    };
};
