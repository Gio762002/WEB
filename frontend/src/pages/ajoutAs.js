import React, { useMemo, useState } from 'react';
import { Button, Grid, AppBar, Toolbar, Typography, Select, MenuItem, Popper, Paper, ClickAwayListener } from '@material-ui/core';
import routerImage from '../routeurss.png'; // Importez votre image de routeur
import '../App.css';

function AjoutAs() {
  const [projects, setProjects] = useState([]); // Liste des projets
  const [selectedProject, setSelectedProject] = useState(''); // Projet sélectionné
  const [asData, setAsData] = useState([]); // Données de l'AS pour le projet actuel
  const [selectedRouter, setSelectedRouter] = useState(null); // Routeur sélectionné
  const [routerInterfaces, setRouterInterfaces] = useState([]); // Interfaces du routeur sélectionné
  const [anchorEl, setAnchorEl] = useState(null); // Élément d'ancrage pour le Popper
  const [open, setOpen] = useState(false); // État d'ouverture du Popper
  const [allrouters, setAllrouters] = useState([]); // Tous les routeurs
  const [otherRouters, setOtherRouters] = useState([]); // Autres routeurs
  const [routerCount, setRouterCount] = useState(1); // Compteur de routeurs
  const [asCount, setAsCount] = useState(1); // Compteur d'AS

  const RouterCount = () => {
    setRouterCount(routerCount + 1);
  };
  const AsCount = () => {
    setAsCount(prevData => prevData + 1);
  };

  // Créer une nouvelle AS dans le projet actuel
  const createNewAS = () => {
    const newAS = {
      id: asCount,
      asNumber: asCount,
      igp : '',
      routers : [],
      links: [],
      buttons: [{id:0, type: "add"}],
    }
    AsCount();
    setAsData(prevData => [...prevData, newAS]);
  };

  // Créer un nouveau routeur et ajouter à l'AS
  const createNewRouter = (containerIndex,) => {
    const newRouter = {
      id: routerCount,
      name: `Routeur ${routerCount}`,
      position: '',
      protocol: '',
      loopback: '',
      interfaces:  {1:'interfaceEthernet0/0', 2:'interfaceEthernet0/1', 3:'interfaceSerial0/0'},
      interfacestatus: {1:'down', 2:'down', 3:'down'},
      interfaceip: {1:'', 2:'', 3:''},
    };
    RouterCount();
    setAllrouters(prevRouters => [...prevRouters, newRouter]);

    setAsData(prevData => {
      const updatedData = [...prevData];
      const asDataItem = updatedData[containerIndex-1];
      asDataItem.buttons.push({ id: routerCount, type: "routeur" });
      console.log(asDataItem.buttons);
      return updatedData;
    });
  }

  // Ajouter un routeur dans l'AS
  // const addRouterButton = (containerIndex,) => {
  //   setAsData(prevData => {
  //     const updatedData = [...prevData];
  //     const asDataItem = updatedData[containerIndex];
  //     RouterCount();
  //     asDataItem.buttons.push({ id: routerCount, type: "routeur" });
  //     return updatedData;
  //   });
  // };



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

  // Effacer un projet
  const clearProject = () => {
    setProjects([]);
    setSelectedProject('');
    setAsData([]);
  };

  // Enregistrer le projet actuel
  const saveProject = () => {
    const projectIndex = projects.findIndex(project => project.name === selectedProject);
    if (projectIndex !== -1) {
      const updatedProjects = [...projects];
      updatedProjects[projectIndex].asData = asData;
      setProjects(updatedProjects);
      alert('Projet enregistré avec succès!');
    }
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


  // Afficher le nom du routeur sélectionné
  const handleRouterButtonClick = (event, routerId) => {
    setSelectedRouter(routerId);
    setAnchorEl(event.currentTarget);
    setOpen(true);
    const currentContainer = asData.find(container => container.buttons.some(button => button.id === routerId));
    const otherRoutersNames = currentContainer.buttons
      .filter(button => button.type === "routeur" && button.id !== routerId)
      .map(button => {
        const otherRouterContainer = asData.find(container => container.buttons.some(btn => btn.id === button.id));
        return { id: button.id, name: `Routeur ${button.id} (${otherRouterContainer.name})` };
      });
    setOtherRouters(otherRoutersNames);

    // Simuler la récupération des interfaces du routeur sélectionné (remplacer par la logique appropriée)
    const interfaces = ['interfaceEthernet0/0', 'interfaceEthernet0/1', 'interfaceSerial0/0'];
    setRouterInterfaces(interfaces);
  };

  // Fermer le Popper
  const handleClose = () => {
    setOpen(false);
  };

  // Gérer le clic sur le bouton du nom d'un routeur
  const handleRouterNameClick = (routerId) => {
    // Vous pouvez implémenter ici la logique pour afficher les informations sur les interfaces du routeur
    console.log("Informations sur les interfaces du routeur:", routerInterfaces);
  };

  // const henderButtons = (container) => {
  //   console.log('called henderButtons');
  //   return container.buttons.map(button => {
  //       let buttonElement;
  //       if (button.type === "add") {
  //         console.log('add button');
  //         buttonElement = (
  //           <Button 
  //             variant="outlined" 
  //             color="primary"
  //             onClick={() => createNewRouter(container.id)}
  //             size="small" // Taille du bouton réduite
  //             // key={button.id}
  //           >
  //             {`+`}
  //           </Button>
  //         );
  //       } else if (button.type === "routeur") {
  //         buttonElement = (
  //           <Button 
  //             variant="contained" 
  //             color="secondary"
  //             onClick={(event) => handleRouterButtonClick(event, button.id)}
  //             style={{ position: 'relative' }}
  //             size="small" // Taille du bouton réduite
  //             // key={button.id}
  //           >
  //             <img src={routerImage} alt={` ${button.id}`} className="router-image" />
  //             <span style={{ position: 'absolute', top: '5px', right: '4px' }}>{button.id}</span>
  //           </Button>
  //         );
  //       }
  //     return (
  //       <div key={button.id}>
  //         {buttonElement}
  //       </div>
  //     );
  //   })
  // };

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
                Liste des projets
              </MenuItem>
              {projects.map(project => (
                <MenuItem key={project.id} value={project.name}>{project.name}</MenuItem>
              ))}
            </Select>
          </Typography>
          <Button color="inherit" onClick={createNewProject}>Nouveau projet</Button>
          <Button color="inherit" onClick={saveProject}>Enregistrer projet</Button>
          <Button color="inherit" onClick={clearProject}>Effacer projet</Button>
        </Toolbar>
      </AppBar>
      <h1>Vous pouvez créer la topologie du réseau</h1>
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
              { container.buttons.map(button => (
                <div key={button.name}>
                  {button.type === "routeur" ? (
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={(event) => handleRouterButtonClick(event, button.id)}
                      style={{ position: 'relative' }}
                      size="small" // Taille du bouton réduite
                    >
                      <img src={routerImage} alt={` ${button.id}`} className="router-image" />
                      <span style={{ position: 'absolute', top: '5px', right: '4px' }}>{button.id}</span>
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => createNewRouter(container.id)}
                      size="small" // Taille du bouton réduite
                    >
                      {`AS ${container.asNumber}`}
                    </Button>
                  )}
                </div>
              ))
              }
            </div>
          </div>
        ))}
        <Popper open={open} anchorEl={anchorEl} placement='top'>
          <ClickAwayListener onClickAway={handleClose}>
            <Paper>
              <Typography variant="body1" style={{ padding: '8px' }}>
                Routeur sélectionné : {selectedRouter}
              </Typography>
              <Typography variant="body1" style={{ padding: '8px' }}>
                Informations sur les interfaces du routeur :
              </Typography>
              <ul>
                {routerInterfaces.map((interfaceName, index) => (
                  <li key={index}>{interfaceName}</li>
                ))}
              </ul>
              <Typography variant="body1" style={{ padding: '8px' }}>
                Tu veux le relier avec quel routeur ?
              </Typography>
              {otherRouters.map((router, index) => (
                <Button 
                  key={index} 
                  variant="contained" 
                  style={{ backgroundColor: '#00ff00', margin: '4px' }} 
                  size="small"
                  onClick={() => handleRouterNameClick(router.id)} // Gérer le clic sur le nom du routeur
                >
                  {router.name}
                </Button>
              ))}
            </Paper>
          </ClickAwayListener>
        </Popper>
      </div>
    </div>
  );
}

export default AjoutAs;
