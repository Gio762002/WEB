import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

export default function OAuth({onLogin}) {
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
        }),
      });
      const data = await res.json();
      console.log(data);
      onLogin();
      navigate('/topo');
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };
  return (
    <Button type="GOOGLE" onClick={handleGoogleClick} variant="contained" color="primary" fullWidth>
    CONTINUE WITH GOOGLE
  </Button>
  );
}