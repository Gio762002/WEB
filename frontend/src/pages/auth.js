//auth.js
import React, { useState } from 'react';
import { Container, Button } from '@material-ui/core';
import SignInForm from '../components/SignInForm';
import LogInForm from '../components/LogInForm';
import logo from '../GNS3.png';

function Auth({onLogin}) {
    const [showSignInForm, setShowSignInForm] = useState(false);
    const [showLogInForm, setShowLogInForm] = useState(false);
    // const [authenticated, setAuthenticated] = useState(false);

    const handleSignIn = () => {
      setShowSignInForm(true);
      setShowLogInForm(false);
    };

    const handleLogIn = () => {
      setShowLogInForm(true);
      setShowSignInForm(false);
    };

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <img src={logo} alt="GNS3 Logo" style={{ marginBottom: '20px' }} /> 
          <h1>WELCOME TO GNS3</h1>
          <div>
            {!onLogin.Login && (
              <>
                <Button variant="contained" color="primary" onClick={handleSignIn} style={{ margin: '10px' }}>
                  Sign in
                </Button>
                <Button variant="contained" color="primary" onClick={handleLogIn} style={{ margin: '10px' }}>
                  Log in
                </Button>
              </>
            )}
          </div>
      
          {showSignInForm && !showLogInForm && <SignInForm />}
          {showLogInForm && !showSignInForm && <LogInForm onLogin={onLogin} />}
        </Container>
    );
};

export default Auth;