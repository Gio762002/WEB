// LogInForm.js
import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';

function LogInForm({ onAuthenticated }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    // Simuler une authentification réussie
    setTimeout(() => {
      setSuccess('Authentification réussie !');
      setError('');
      onAuthenticated();
    }, 1000);
  };

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
