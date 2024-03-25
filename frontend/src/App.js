// App.js
import React, {useState} from 'react';
import {  BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import AjoutAs from './pages/ajoutAs'; 
import Auth from './pages/auth';

function App() {
  const [Login, setLogin] = useState(false);

  const handleLogin = () => {
    console.log(Login);
    <Navigate to="/"/>
    return setLogin(true);
  };
  
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Auth onLogin={handleLogin} />} />
        <Route path="/" element={ <AjoutAs />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
)};

export default App;

