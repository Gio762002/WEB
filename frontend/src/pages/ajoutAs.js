import React, { useState } from 'react';
import { Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import routerImage from '../routeurss.png'; // Importez votre image de routeur
import '../App.css';

function AjoutAs() {
  const [asData, setAsData] = useState([]);

  const createNewAS = () => {
    setAsData(prevData => [
      ...prevData,
      {
        id: prevData.length,
        asNumber: prevData.length + 1, // Numéro de l'AS
        routerCount: 0, // Compteur de routeurs initialisé à zéro
        buttons: [{ id: 0, type: "normal" }] // Ajout d'un bouton initial normal à chaque nouveau rectangle
      }
    ]);
  };

  const addRouterButton = (containerIndex) => {
    setAsData(prevData => {
      const updatedData = [...prevData];
      updatedData[containerIndex].routerCount++; // Incrémenter le compteur de routeurs pour cet AS
      updatedData[containerIndex].buttons.push({ id: updatedData[containerIndex].routerCount, type: "routeur" }); // Ajout d'un nouveau bouton de type "routeur" avec le numéro de routeur correspondant
      return updatedData;
    });
  };

  const handleRouterButtonClick = () => {
    setOpenDialog(true);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div className="App">
      <h1>En utilisant les buttons tu pourrais créer la topologie du réseau </h1>
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
            <div className="rectangle">
              {container.buttons.map(button => (
                <Button key={button.id} variant="contained" color={button.type === "routeur" ? "secondary" : "primary"} onClick={button.type === "routeur" ? handleRouterButtonClick : () => addRouterButton(container.id)}>
                {button.type === "routeur" ? (
                  <>
                    <img src={routerImage} alt={` ${button.id}`} className="router-image" />
                      - {button.id}
                  </>
                ) : `AS ${container.asNumber}`}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hello
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AjoutAs;