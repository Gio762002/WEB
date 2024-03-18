import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import './App.css';

function AjoutAs() {
  const [asData, setAsData] = useState([]);

  const createNewAS = () => {
    setAsData(prevData => [
      ...prevData,
      {
        id: prevData.length,
        squares: [{ color: "green", id: 0 }] // Ajout d'un carré vert initial
      }
    ]);
  };

  const addYellowSquare = (containerIndex) => {
    setAsData(prevData => {
      const updatedData = [...prevData];
      const container = updatedData[containerIndex];
      const lastSquare = container.squares[container.squares.length - 1];
      container.squares.push({ color: "yellow", id: lastSquare.id + 1 }); // Ajout d'un carré jaune à droite du dernier carré
      return updatedData;
    });
  };

  return (
    <div className="App">
      <h1>Créer une nouvelle AS</h1>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={createNewAS}>
            Créer une nouvelle AS
          </Button>
        </Grid>
      </Grid>
      <div className="as-wrapper">
        {asData.map(container => (
          <div key={container.id} className="as-container">
            {container.squares.map(square => (
              <div key={square.id} className={`${square.color}-square`} onClick={() => addYellowSquare(container.id)}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AjoutAs;
