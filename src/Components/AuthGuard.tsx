import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {validateSession} from "../utils/api/auth.ts";

const AuthGuard: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await validateSession();
                if (response.success) {
                    setIsAuthenticated(true);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : null;
};

export default AuthGuard;
