import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';

function SignInForm() {
  const [UserName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitSignIn = (e) => {
    e.preventDefault();
    if (!UserName || !password || !email) {
      setError('Veuillez remplir tous les champs.');
      setSuccess('');
    } else if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse e-mail valide.');
      setSuccess('');
    } else {
      setSuccess('Utilisateur bien ajouté !');
      setError('');
      // Réinitialiser les valeurs des champs de formulaire
      setUserName('');
      setPassword('');
      setEmail('');
    }
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <form style={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Username"
            variant="outlined"
            value={UserName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmitSignIn} 
            fullWidth
          >
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
export default SignInForm;
