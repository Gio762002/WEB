import React, { useState, useEffect } from 'react';
import { Button, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@material-ui/core';
import routeurImage from './routeurss.png'; // Importez votre image de routeur

function App() {
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [mode, setMode] = useState('draw'); // 'draw', 'move', 'watch', 'newAS'
  const [draggingPointIndex, setDraggingPointIndex] = useState(null); 
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 }); 
  const [asRouters, setAsRouters] = useState({});
  const [newAsName, setNewAsName] = useState('');
  const [newAsRouters, setNewAsRouters] = useState([]);

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
        end: endRouter
      };
  
      setLines(prevLines => [...prevLines, newLine]);
  
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

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Dessiner les lignes entre les routeurs
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

  const handlePointClick = (index) => {
    if (mode === 'move') {
      if (draggingPointIndex === null) {
        setDraggingPointIndex(index);
        setInitialMousePosition({ x: points[index].x, y: points[index].y });
      } else {
        setDraggingPointIndex(null);
      }
    } else if (mode === 'draw') {
      // Vérifier si le point sélectionné est déjà sélectionné
      if (!selectedPoints.includes(index)) {
        if (selectedPoints.length < 2) {
          setSelectedPoints(prevSelected => [...prevSelected, index]);
        } else {
          setSelectedPoints([index]);
        }
      }
    } else if (mode === 'newAS') {
      setNewAsRouters(prevRouters => [...prevRouters, index]);
    }
  };

  const handleMouseMove = (event) => {
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
  
  const handleMouseUp
  = () => {
    if (draggingPointIndex !== null) {
      setDraggingPointIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingPointIndex]);

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'newAS') {
      setNewAsName(prompt('Nom de l\'AS :'));
      setNewAsRouters([]);
    }
  };

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

  useEffect(() => {
    setAsRouters((prevAsRouters) => {
      return {
        ...prevAsRouters,
        [newAsName]: newAsRouters
      };
    });
  }, [newAsName, newAsRouters]);

  return (
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
        <Button onClick={() => handleModeChange('newAS')} variant={mode === 'newAS' ? 'contained' : 'text'} color="primary" style={{ marginBottom: '10px', width: '100%' }}>
          Nouvel AS
        </Button>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
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
        <Button onClick={() => handleModeChange('watch')} variant={mode === 'watch' ? 'contained' : 'text'} color="primary" style={{ marginTop: '30px', marginBottom: '10px', width: '100%' }}>
          Exporter configuration
        </Button>
      </div>
      <div style={{ position: 'relative' }}>
        {points.map((point, index) => (
          <React.Fragment key={index}>
            <img
              src={routeurImage}
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
          height={window.innerHeight - 50}
          style={{ border: '2px solid black', margin: '20px' }}>
        </canvas>
      </div>
    </div>
  );
}

export default App;
