import React, { useState } from 'react';
import { Button, Grid, AppBar, Toolbar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem } from '@material-ui/core';
import routerImage from './routeurss.png'; // Importez votre image de routeur
import './App.css';

function AjoutAs() {
  const [projects, setProjects] = useState([]); // Liste des projets
  const [selectedProject, setSelectedProject] = useState(''); // Projet sélectionné
  const [asData, setAsData] = useState([]); // Données de l'AS pour le projet actuel
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Etat du dialogue de suppression du projet

  // Créer un nouveau projet
  const createNewProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: `Projet ${projects.length + 1}`,
      asData: [] // Données de l'AS pour ce projet
    };
    setProjects(prevProjects => [...prevProjects, newProject]);
    setSelectedProject(newProject.name); // Sélectionner le nouveau projet
    setAsData([]); // Réinitialiser les données de l'AS
  };

  // Enregistrer les données de l'AS pour le projet actuel
  const saveProject = () => {
    const updatedProjects = projects.map(project => {
      if (project.name === selectedProject) {
        return { ...project, asData: asData };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  // Effacer un projet
  const deleteProject = () => {
    const updatedProjects = projects.filter(project => project.name !== selectedProject);
    setProjects(updatedProjects);
    setSelectedProject('');
    setAsData([]);
    setOpenDeleteDialog(false);
  };

  // Gérer le changement de projet sélectionné
  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
    const project = projects.find(proj => proj.name === event.target.value);
    if (project) {
      setAsData(project.asData);
    } else {
      setAsData([]);
    }
  };

  // Afficher le dialogue de suppression du projet
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // Fermer le dialogue de suppression du projet
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Créer une nouvelle AS dans le projet actuel
  const createNewAS = () => {
    setAsData(prevData => [
      ...prevData,
      {
        id: prevData.length,
        asNumber: prevData.length + 1,
        routerCount: 0,
        buttons: [{ id: 0, type: "normal" }]
      }
    ]);
  };

  // Ajouter un routeur dans l'AS
  const addRouterButton = (containerIndex) => {
    setAsData(prevData => {
      const updatedData = [...prevData];
      const asDataItem = updatedData[containerIndex];
      const newRouterId = asDataItem.routerCount + 1;
      asDataItem.routerCount++;
      asDataItem.buttons.push({ id: newRouterId, type: "routeur" });
      return updatedData;
    });
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            <Select
              value={selectedProject}
              onChange={handleProjectChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Projet' }}
            >
              <MenuItem value="" disabled>
                Projet
              </MenuItem>
              {projects.map(project => (
                <MenuItem key={project.id} value={project.name}>{project.name}</MenuItem>
              ))}
            </Select>
          </Typography>
          <Button color="inherit" onClick={createNewProject}>Nouveau projet</Button>
          <Button color="inherit" onClick={saveProject} disabled={!selectedProject}>Enregistrer</Button>
          <Button color="inherit" onClick={handleOpenDeleteDialog} disabled={!selectedProject}>Effacer projet</Button>
        </Toolbar>
      </AppBar>
      <h1>En utilisant les boutons, vous pouvez créer la topologie du réseau</h1>
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
                <Button key={button.id} variant="contained" color={button.type === "routeur" ? "secondary" : "primary"} onClick={button.type === "routeur" ? null : () => addRouterButton(container.id)}>
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
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir effacer ce projet ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={deleteProject} color="primary">
            Effacer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AjoutAs;
