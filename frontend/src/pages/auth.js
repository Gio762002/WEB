//auth.js
import React from 'react';
import { Container } from '@material-ui/core';
import logo from '../components/GNS3.png';
import AuthGoogle from '../components/AuthGoogle';

function Auth({onLogin}) {
    return (
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <img src={logo} alt="GNS3 Logo" style={{ marginBottom: '20px' }} /> 
          <h1>WELCOME TO GNS3</h1>
          <div>
            {
            <AuthGoogle onLogin={onLogin}/>  
            }
          </div>
        </Container>
    );
};

export default Auth;