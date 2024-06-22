import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import {logout} from "../../utils/api/auth.ts";
import Logo from "../Logo/Logo.tsx";

interface User {
    name: string;
}

interface HeaderProps {
    user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" flexGrow={1} alignItems="center">
                    <Link to="/">
                        <Logo />
                    </Link>
                    <Typography variant="h6">
                        Hello, {user.name}
                    </Typography>
                </Box>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
