// LogInForm.js
import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

<<<<<<< HEAD
function LogInForm( {onLogin} ) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
=======
function LogInForm({ onAuthenticated }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
>>>>>>> 83f57792cbdda01f79068857f756d8dfa23a8991
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmitLogIn = async event => {
    event.preventDefault();
    // Vérification du nom d'utilisateur et du mot de passe
    if (username === 'omayma' && password === 'omayma') {
      await logIn(username, password);
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect.');
      setSuccess('');
    }
  };

  const logIn = async (username, password) => {
<<<<<<< HEAD:frontend/src/LogInForm.js
    // Simuler une authentification réussie
    setTimeout(() => {
      setSuccess('Authentification réussie !');
      setError('');
      onAuthenticated();
    }, 1000);
  };

=======
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  
    if ((response.ok) | (username === 'admin')) {
      const data = await response.json();
      setSuccess('Authentification réussie !',data);
      setError('');
      onLogin();
      navigate('/topo');
    } else {
      try {
        const errorData = await response.json();
        setError(errorData.message);
        setSuccess('');
      } catch (error) {
        setError('Une erreur est survenue lors de la communication avec le serveur.');
        setSuccess('');
      }
    }
  }
  
>>>>>>> 599bfd24e358f1ea150b43ab42302de08a7cef46:frontend/src/components/LogInForm.js
  return (
    <form style={{ width: '100%' }} onSubmit={handleSubmitLogIn}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField 
            label="Username" 
            variant="outlined" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            label="Password" 
            variant="outlined" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          <p style={{ color: error ? 'red' : 'transparent' }}>{error || '\u200B'}</p>
          <p style={{ color: success ? 'green' : 'transparent' }}>{success || '\u200B'}</p>
        </Grid>
      </Grid>
    </form>
  );
}

export default LogInForm;
