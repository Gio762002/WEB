// LogInForm.js
import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';

function LogInForm({ onAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitLogIn = () => {
    if (username.trim() === 'omayma' && password.trim() === 'omayma') {
      setSuccess('Authentification réussie !');
      setError('');
      // Appeler la fonction onAuthenticated pour rediriger vers la page AjoutAs
      onAuthenticated();
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect.');
      setSuccess('');
    }
  };

  return (
    <form style={{ width: '100%' }}>
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
          <Button variant="contained" color="primary" onClick={handleSubmitLogIn} fullWidth>
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
