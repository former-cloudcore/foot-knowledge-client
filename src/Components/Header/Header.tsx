import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AppBar, Toolbar, Typography, Button, Box} from '@mui/material';
import {logout} from '../../utils/api/auth.ts';
import Logo from '../Logo/Logo.tsx';

interface User {
    name: string;
}

interface HeaderProps {
    user: User;
}

const Header: React.FC<HeaderProps> = ({user}) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <AppBar position="static" style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
            <Toolbar>
                <Box display="flex" alignItems="center">
                    <Link to="/" style={{display: 'flex', alignItems: 'center', textDecoration: 'none'}}>
                        <Logo/>
                    </Link>
                </Box>
            </Toolbar>
            <Toolbar>
                <Box display="flex" alignItems="flex-end">
                    {user?.name && (
                        <Typography variant="h6" style={{marginLeft: '1rem', color: 'white'}}>
                            Hello, {user.name}
                        </Typography>
                    )}
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
