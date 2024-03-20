// App.js
import React, {useState} from 'react';
import {  BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import AjoutAs from './pages/ajoutAs'; 
import Auth from './pages/auth';

function App() {
  const [authen, setAuthen] = useState(false);

  const handleAuthen = () => {
    setAuthen(true);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth onAuthenticated={handleAuthen} />} />
        <Route path="/topo" element={authen ? <AjoutAs /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
)};

export default App;

