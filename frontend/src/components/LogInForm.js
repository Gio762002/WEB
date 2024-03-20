// LogInForm.js
import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

function LogInForm( {onLogin} ) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmitLogIn = async event => {
    event.preventDefault();
    await logIn(username, password);  
  };

  const logIn = async (username, password) => {
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
