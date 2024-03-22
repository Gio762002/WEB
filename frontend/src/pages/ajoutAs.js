import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import routerImage from '../routeurss.png'; // Importez votre image de routeur
import '../App.css';

function AjoutAs() {
  const [routers, setRouters] = useState([]); // Liste des routeurs avec leurs positions
  const [activeRouterIndex, setActiveRouterIndex] = useState(null); // Indice du routeur actuellement sélectionné pour le déplacement
  const [connections, setConnections] = useState([]); // Liste des connexions entre les routeurs

  // Fonction pour ajouter un nouveau routeur
  const addRouter = (event) => {
    if (event.target.tagName === 'BUTTON') { // Vérifier si le clic provient du bouton "Ajouter un routeur"
      const newRouter = {
        id: routers.length,
        x: event.clientX - 25, // Positionner le centre de l'image à l'emplacement du clic
        y: event.clientY - 25,
      };
      setRouters(prevRouters => [...prevRouters, newRouter]);
      setActiveRouterIndex(routers.length); // Sélectionner le nouveau routeur pour le déplacement immédiat
    }
  };

  // Fonction pour mettre à jour la position d'un routeur lors du déplacement
  const updateRouterPosition = (event) => {
    if (activeRouterIndex !== null) {
      const newRouters = [...routers];
      newRouters[activeRouterIndex] = {
        ...newRouters[activeRouterIndex],
        x: event.clientX - 25, // Positionner le centre de l'image à l'emplacement du curseur
        y: event.clientY - 25,
      };
      setRouters(newRouters);
    }
  };

  // Fonction pour sélectionner un routeur pour le déplacement
  const selectRouter = (index) => {
    setActiveRouterIndex(index);
  };

  // Fonction pour désélectionner le routeur actif
  const deselectRouter = () => {
    setActiveRouterIndex(null);
  };

  // Fonction pour relier deux routeurs
  const connectRouters = (event) => {
    const selectedRouterIndex = parseInt(event.target.dataset.index);
    if (!isNaN(selectedRouterIndex)) {
      if (activeRouterIndex !== null && activeRouterIndex !== selectedRouterIndex) {
        const newConnections = [...connections, { from: activeRouterIndex, to: selectedRouterIndex }];
        setConnections(newConnections);
      }
    }
  };

  return (
    <div className="App" onMouseMove={updateRouterPosition} onMouseDown={addRouter}>
      <h1>Vous pouvez créer la topologie du réseau</h1>
      <Grid container spacing={2}>
        <Grid item>
          <button>Ajouter un routeur</button>
        </Grid>
        <Grid item>
          <button onClick={connectRouters}>Relier</button>
        </Grid>
      </Grid>
      <div className="as-wrapper">
        {connections.map((connection, index) => (
          <svg key={index} style={{ position: 'absolute', zIndex: -1 }}>
            <line
              x1={routers[connection.from].x + 25}
              y1={routers[connection.from].y + 25}
              x2={routers[connection.to].x + 25}
              y2={routers[connection.to].y + 25}
              style={{ stroke: 'black', strokeWidth: 2 }}
            />
          </svg>
        ))}
        {routers.map((router, index) => (
          <img
            key={index}
            src={routerImage}
            alt={`Routeur ${index}`}
            className="router-image"
            style={{ position: 'absolute', left: router.x, top: router.y, cursor: 'move' }}
            onMouseDown={() => selectRouter(index)}
            onMouseUp={deselectRouter}
          />
        ))}
      </div>
    </div>
  );
}

export default AjoutAs;

