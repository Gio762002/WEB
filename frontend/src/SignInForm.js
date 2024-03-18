import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';

function SignInForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitSignIn = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      setError('Veuillez remplir tous les champs.');
      setSuccess('');
    } else if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse e-mail valide.');
      setSuccess('');
    } else {
      setSuccess('Utilisateur bien ajouté !');
      setError('');
      // Réinitialiser les valeurs des champs de formulaire
      setFirstName('');
      setLastName('');
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
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmitSignIn} fullWidth>
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </Grid>
      </Grid>
    </form>
  );
}
export default SignInForm;
