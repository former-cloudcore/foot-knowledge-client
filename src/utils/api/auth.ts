import {AUTH_API_BASE} from "../consts.ts";

interface AuthResponse {
    token: string;
}

interface Credentials {
    email: string;
    password: string;
}

interface SignupData {
    name: string;
    role: string;
    credentials: Credentials;
}

export const login = async (credentials: Credentials): Promise<AuthResponse> => {
    const response = await fetch(`${AUTH_API_BASE}/auth/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
};


export const signup = async (data: SignupData): Promise<void> => {
    const response = await fetch(`${AUTH_API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Signup failed');
    }
};

export const validateSession = async (): Promise<{ success: boolean }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${AUTH_API_BASE}/auth/validateSession`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Session validation failed');
    }

    return response.json();
};

export const userProfile = async (): Promise<{ name: string, image: string }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${AUTH_API_BASE}/auth/userProfile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to get profile');
    }

    return response.json();
};

export const generateProfileImage = async (prompt: string): Promise<{image: string}> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${AUTH_API_BASE}/auth/generateProfileImage`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt}),
    });

    if (!response.ok) {
        throw new Error('Failed to generate profile image');
    }

    return response.json();
}

export const logout = async (): Promise<void> => {
    await fetch(`${AUTH_API_BASE}/auth/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    localStorage.removeItem('token');
    window.location.reload();
};
