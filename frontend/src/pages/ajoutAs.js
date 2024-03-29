/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper, Menu, MenuItem } from '@material-ui/core';
import routeurImage from './routeurss.png'; // Importez votre image de routeur
import routerImage_chose from './routeurss_choose.png'; // Importez votre image de routeur
import FormDialog from '../components/askAS';

function App() {
  // États pour les points, lignes et points sélectionnés
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  // États pour le mode, le point en cours de déplacement, la position initiale de la souris, les AS et le nom de l'AS en cours de création
  const [mode, setMode] = useState('draw');
  const [draggingPointIndex, setDraggingPointIndex] = useState(null);
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
  const [asRouters, setAsRouters] = useState({});
  const [newAsRouters, setNewAsRouters] = useState([]);
  //component form dialog
  const [asNumbers, setAsNumbers] = useState([]); // tous les numéros utilisés pour les AS
  const [asId,setAsId] = useState('');
  const [AsInfo, setAsInfo] = useState(new Map()); 

  // États pour les projets et le projet actuel sélectionné
  const [projects, setProjects] = useState([{ name: 'Projet 1', data: { points: [], lines: [], asRouters: {} } }]);
  const [currentProject, setCurrentProject] = useState('Projet 1');
  const [selectedProjectName, setSelectedProjectName] = useState('Projet 1');
  // États pour le menu et le routeur sélectionné pour le changement d'image
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRouter, setSelectedRouter] = useState(null);
  // État pour le type de configuration sélectionné
  const [configType, setConfigType] = useState('');

  // Basculer vers le projet par défaut au début
  useEffect(() => {
    switchProject('Projet 1');
  }, []);

  // Fonction pour créer un nouveau projet
  const createNewProject = () => {
    const projectName = prompt('Nom du nouveau projet :');
    if (projectName) {
      setProjects(prevProjects => [...prevProjects, { name: projectName, data: { points: [], lines: [], asRouters: {} } }]);
    }
  };

  // Fonction pour basculer entre les projets
  const switchProject = (projectName) => {
    // Sauvegarder les données du projet actuel avant de basculer vers le nouveau projet
    if (currentProject) {
      const currentProjectIndex = projects.findIndex(project => project.name === currentProject);
      if (currentProjectIndex !== -1) {
        const updatedProjects = [...projects];
        updatedProjects[currentProjectIndex] = {
          name: currentProject,
          data: { points, lines, asRouters }
        };
        setProjects(updatedProjects);
      }
    }

    const projectData = projects.find(project => project.name === projectName);
    if (projectData) {
      setPoints(projectData.data.points || []);
      setLines(projectData.data.lines || []);
      setAsRouters(projectData.data.asRouters || {});
      setCurrentProject(projectName);
      setSelectedProjectName(projectName); // Ajouter cette ligne pour définir le nom du projet sélectionné
    }
  };

  // Fonction pour afficher le menu principal
  const handleMenuClick = (event) => {
    setSelectedRouter(null);
    setAnchorEl(event.currentTarget);
  };

  // Fonction pour fermer le menu principal
  const handleMenuClose = () => {
    setSelectedRouter(null);
    setAnchorEl(null);
  };

  // Fonction pour afficher le menu de sélection de projet
  const handleProjectSelect = (projectName) => {
    setSelectedRouter(null);
    handleMenuClose();
    switchProject(projectName);
  };

  // Effet pour charger les projets depuis le stockage local ou toute autre source de données
  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  // Effet pour enregistrer les projets dans le stockage local à chaque modification
  // Effet pour sauvegarder les données du projet actuel avant de basculer vers le nouveau projet
  useEffect(() => {
    if (currentProject) {
      const currentProjectIndex = projects.findIndex(project => project.name === currentProject);
      if (currentProjectIndex !== -1) {
        const updatedProjects = [...projects];
        updatedProjects[currentProjectIndex] = {
          name: currentProject,
          data: { points, lines, asRouters }
        };
        setProjects(updatedProjects);
      } else {
        setProjects(prevProjects => [
          ...prevProjects,
          { name: currentProject, data: { points, lines, asRouters } }
        ]);
      }
    }
  }, [currentProject]);

  // Effet pour gérer la création d'une nouvelle ligne lors de la sélection de deux points
  useEffect(() => {
    if (selectedPoints.length === 2) {
      const [startIndex, endIndex] = selectedPoints;
      const startRouter = points[startIndex];
      const endRouter = points[endIndex];
      if (startRouter.connections === 3) {
        alert(`Pas d'interfaces disponibles pour le routeur R${startIndex + 1}.`);
        return;
      }

      if (endRouter.connections === 3) {
        alert(`Pas d'interfaces disponibles pour le routeur R${endIndex + 1}.`);
        return;
      }

      const newLine = {
        start: startRouter,
        end: endRouter,
        connectedRouter : [startIndex+1, endIndex+1],
        connectedInterface : [(startRouter.connections|| 0) + 1, (endRouter.connections|| 0) + 1],
      };
      // TODO : BD IP adresse distribution  
      setLines(prevLines => [...prevLines, newLine]);
      console.log('connected routers:', newLine.connectedRouter);
      console.log('connected interfaces:',newLine.connectedInterface);

      // Mettre à jour la disponibilité des points liés
      const updatedPoints = points.map((point, index) => {
        if (index === startIndex || index === endIndex) {
          return { ...point, available: false, connections: (point.connections || 0) + 1 };
        }
        return point;
      });

      setPoints(updatedPoints);
      setSelectedPoints([]);
    }
  }, [selectedPoints, points, lines]);

  // Effet pour dessiner les lignes entre les routeurs et les cercles autour des AS
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Dessiner les cercles autour des AS
    let colorIndex = 0;
    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF33A8', '#33A8FF', '#A8FF33', '#FF3333', '#3333FF', '#33FFA8'];
    Object.entries(asRouters).forEach(([as, routers]) => {
      // Trouver les coordonnées minimales et maximales des routeurs de l'AS
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      routers.forEach(routerIndex => {
        const router = points[routerIndex];
        minX = Math.min(minX, router.x);
        minY = Math.min(minY, router.y);
        maxX = Math.max(maxX, router.x);
        maxY = Math.max(maxY, router.y);
      });

      // Dessiner le cercle englobant avec un espace supplémentaire autour de chaque routeur
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const radiusX = (Math.max(maxX - minX, maxY - minY) / 2) + 30; // Ajout de 30 pour un ovale plus grand
      const radiusY = (Math.max(maxX - minX, maxY - minY) / 2) + 20; // Ajout de 20 pour un ovale plus grand

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = colors[colorIndex % colors.length]; // Couleur du cercle
      ctx.lineWidth = 2;
      ctx.stroke();

      // Étiquette de l'AS
      ctx.font = '15px Arial';
      ctx.fillStyle = colors[colorIndex % colors.length];
      ctx.fillText(`AS ${as}`, centerX - 20, centerY + 5);

      colorIndex++;
    });
  }, [lines, asRouters, points]);

  // Gestionnaire de clic sur un point
  const handlePointClick = (index) => {
    if (mode === 'move') {
      if (draggingPointIndex === null) {
        setSelectedRouter(null);
        setDraggingPointIndex(index);
        setInitialMousePosition({ x: points[index].x, y: points[index].y });
      } else {
        setDraggingPointIndex(null);
      }
    } else if (mode === 'draw') {
      // Vérifier si le point sélectionné est déjà sélectionné
      
      if (!selectedPoints.includes(index)) {
        setSelectedRouter(index); 
        if (selectedPoints.length  < 2) {
          setSelectedPoints(prevSelected => [...prevSelected, index]);
        } else {
          setSelectedPoints([index]);
        }
      }
    } else if (mode === 'newAS') {
      setSelectedRouter(null);
      // Vérifier si le routeur est déjà dans un AS
      const isRouterInAs = Object.values(asRouters).some(asRoutersArray => asRoutersArray.includes(index));
      if (!isRouterInAs) {
        setNewAsRouters(prevRouters => [...prevRouters, index]);
      } else {
        alert(`Le routeur R${index + 1} est déjà dans un AS.`);
      }
    }
  };

  // Gestionnaire de mouvement de la souris
  const handleMouseMove = (event) => {
    setSelectedRouter(null);
    if (draggingPointIndex !== null) {
      // Récupère l'élément canvas ou le conteneur parent des routeurs
      const canvas = document.getElementById('canvas');

      // Calcule la position relative en soustrayant la position du coin supérieur gauche du canvas
      const rect = canvas.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top + 35;

      const updatedPoints = [...points];
      updatedPoints[draggingPointIndex] = {
        x: relativeX,
        y: relativeY,
        connections: points[draggingPointIndex].connections // Conserver le nombre de connexions
      };
      setPoints(updatedPoints);

      // Mise à jour des lignes lorsque le point est déplacé
      const updatedLines = lines.map(line => {
        if (line.start.x === initialMousePosition.x && line.start.y === initialMousePosition.y) {
          return { ...line, start: { x: relativeX, y: relativeY } };
        }
        if (line.end.x === initialMousePosition.x && line.end.y === initialMousePosition.y) {
          return { ...line, end: { x: relativeX, y: relativeY } };
        }
        return line;
      });
      setLines(updatedLines);
    }
  };

  // Gestionnaire de relâchement de la souris
  const handleMouseUp = () => {
    if (draggingPointIndex !== null) {
      setDraggingPointIndex(null);
    }
  };

  // Effet pour ajouter les écouteurs d'événements de la souris
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingPointIndex]);

  // Gestionnaire de changement de mode
  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    // if (selectedMode === 'newAS') {
      // let asID = prompt('Numéro de l\'AS :');
      //   if ((isNaN(asID) || asID === '' || asID === null ) && asNumbers.includes(asID)) {
      //     alert('Veuillez saisir un numéro d\'AS valide.');
      //   } else {
      //     setNewAsid(asID);
      //     setAsNumbers(prevAsNumbers => [...prevAsNumbers, asID]);
      //   }
      // setNewAsRouters([]);
    // }
  };

  const handleDialogInfo = (id, range, protocol) => {
    setAsId(id);
    setAsNumbers(prevAsNumbers => [...prevAsNumbers, asId]);
    setNewAsRouters([]);
    setAsInfo(prevAsinfo => new Map(prevAsinfo.set(id, {'id':id,'range': range, 'protocol': protocol})));
    console.log('AS Info:', AsInfo);
  };

  // Fonction pour ajouter un routeur aléatoire
  const addRandomRouter = () => {
    const canvas = document.getElementById('canvas');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Générer un point aléatoire
    const newPoint = {
      x: Math.random() * (canvasWidth - 60) + 30, // Ajustez selon la taille de votre image de routeur
      y: Math.random() * (canvasHeight - 60) + 20,
    };

    // Ajouter le nouveau point à la liste des points existants
    setPoints(prevPoints => [...prevPoints, newPoint]);
  };

  // Effet pour mettre à jour les AS lors de la création d'un nouvel AS
  useEffect(() => {
    setAsRouters((prevAsRouters) => {
      return {
        ...prevAsRouters,
        [asId]: newAsRouters
      };
    });
    console.log('AS Routers:', asRouters);
  }, [asId, newAsRouters]);

// Fonction pour gérer le clic sur le bouton "Exporter configuration"
  const handleExportConfiguration = () => {
    for (let [key, value] of AsInfo.entries()) {
      console.log(key, value);
    }
    console.log('AS Routers:', asRouters);
    console.log('Lines:', lines);
  };


  // Retourner le contenu JSX de l'application
  return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(63, 81, 189, 1)', color: 'white', padding: '20px', borderBottom: '2px solid #ccc' }}>
        <div>
          <Button onClick={createNewProject} variant="text" color="inherit" style={{ marginRight: '30px' }}>
            Nouveau projet
          </Button>
          <Button onClick={handleMenuClick} variant="text" color="inherit" style={{ marginRight: '30px' }}>
            Sélectionner projet
          </Button>
          <Menu
            id="project-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            style={{ marginTop: '50px'}} 
          >
            {projects.map((project, index) => (
              <MenuItem key={index} onClick={() => handleProjectSelect(project.name)}>{project.name}</MenuItem>
            ))}
          </Menu>
          {/* Autres options de menu */}
        </div>
        <div>
          {/* Autres boutons alignés à droite */}
        </div>
      </div>
      <div style={{ position: 'absolute', top: '120px', left: '250px', fontFamily: 'Arial', fontSize: '24px', fontWeight: 'bold' }}>
        {selectedProjectName}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', height: '100vh' }}>
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
          <Button onClick={addRandomRouter} variant="text" color="primary" style={{ marginBottom: '10px', width: '100%' }}>
            Ajouter Routeur
          </Button>
          <Button onClick={() => handleModeChange('draw')} variant={mode === 'draw' ? 'contained' : 'text'} color="primary" style={{ marginBottom: '10px', width: '100%' }}>
            Relier les routeurs
          </Button>
          <Button onClick={() => handleModeChange('move')} variant={mode === 'move' ? 'contained' : 'text'} color="primary" style={{ marginBottom: '10px', width: '100%' }}>
            Déplacer les routeurs
          </Button>
          {/* <Button onClick={() => handleModeChange('newAS')} variant={mode === 'newAS' ? 'contained' : 'text'} color="primary" style={{ marginTop: '30px',marginBottom: '0px', width: '100%' }}>
            Nouvel AS
          </Button> */}
          <FormDialog mode={mode} handleModeChange={handleModeChange} handleDialogInfo={handleDialogInfo}/>
          <TableContainer component={Paper} style={{ marginTop: '0px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>AS</TableCell>
                  <TableCell>Routeurs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(asRouters).map(([as, routers], index) => (
                  <TableRow key={index}>
                    <TableCell>{as}</TableCell>
                    <TableCell>{routers.map(routerIndex => `R${routerIndex + 1}`).join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleExportConfiguration} variant={mode === 'watch' ? 'contained' : 'text'} color="primary" style={{ marginTop: '100px', marginBottom: '10px', width: '100%' }}>
  Exporter configuration
</Button>
        </div>
        <div style={{ position: 'relative' }}>
          {points.map((point, index) => (
            <React.Fragment key={index}>
              <img
                src={index === selectedRouter ? routerImage_chose: routeurImage}
                style={{
                  position: 'absolute',
                  left: point.x,
                  top: point.y,
                  width: '60px',
                  height: '40px',
                  cursor: mode === 'draw' ? 'pointer' : 'move'
                }}
                onMouseDown={() => handlePointClick(index)}
                alt="routeur" 
              />
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="control-point"
                  style={{
                    position: 'absolute',
                    left: point.x + 5 + i * 20,
                    top: point.y + 22,
                    width: '10px',
                    height: '7px',
                    backgroundColor: point.connections && point.connections > i ? 'red' : 'greenyellow',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                ></div>
              ))}
              <div
                style={{
                  position: 'absolute',
                  left: point.x + 20,
                  top: point.y + 40,
                  color: 'black',
                  fontSize: '15px'
                }}
              >
                {`R${index + 1}`}
              </div>
            </React.Fragment>
          ))}
          <canvas
            id="canvas"
            width={window.innerWidth - 250}
            height={window.innerHeight - 130}
            style={{ border: '2px solid black', margin: '20px' }}>
          </canvas>
        </div>
      </div>
    </div>
  );
}

export default App;
 
  
