import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import routeurImage from './routeurss.png'; // Importez votre image de routeur

function App() {
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [mode, setMode] = useState('draw'); // 'draw', 'move', 'watch', 'group'
  const [draggingPointIndex, setDraggingPointIndex] = useState(null);
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
  const [showDialog, setShowDialog] = useState(false); // état pour afficher la boîte de dialogue
  const [configuration, setConfiguration] = useState(null); // état pour stocker la configuration choisie
  const [groupingShapes, setGroupingShapes] = useState([]); // état pour stocker les informations sur les formes de regroupement

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
    lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [lines]);

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
    } else if (mode === 'group') {
      // Récupérer les points sélectionnés pour le regroupement
      const selectedRouters = selectedPoints.map(idx => points[idx]);
      // Ajouter la forme de regroupement avec les points sélectionnés
      setGroupingShapes(prevShapes => [...prevShapes, selectedRouters]);
      setSelectedPoints([]); // Réinitialiser les points sélectionnés
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

  const handleMouseUp = () => {
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
    if (selectedMode === 'watch') {
      setShowDialog(true); // Afficher la boîte de dialogue lorsque le mode est changé en "watch"
    } else {
      setMode(selectedMode);
    }
  };

  const addRandomRouter = () => {
    const canvas = document.getElementById('canvas');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Générer un point aléatoire
    const newPoint = {
      x: Math.random() * (canvasWidth - 60) + 30,
      y: Math.random() * (canvasHeight - 60) + 20,
      connections: 0 // Initialiser le nombre de connexions à 0
    };
  
    // Ajouter le nouveau point à la liste des points existants
    setPoints(prevPoints => [...prevPoints, newPoint]);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', height: '100vh' }}>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
        <Button
          onClick={addRandomRouter}
          variant="text"
          color="primary"
          style={{ marginBottom: '10px', width: '100%' }}
        >
          Ajouter Routeur
        </Button>
        <Button
          onClick={() => handleModeChange('draw')}
          variant={mode === 'draw' ? 'contained' : 'text'}
          color="primary"
          style={{ marginBottom: '10px', width: '100%' }}
        >
          Relier les routeurs
        </Button>
        <Button
          onClick={() => handleModeChange('move')}
          variant={mode === 'move' ? 'contained' : 'text'}
          color="primary"
          style={{ marginBottom: '10px', width: '100%' }}
        >
          Déplacer les routeurs
        </Button>
        <Button
          onClick={() => handleModeChange('watch')}
          variant={mode === 'watch' ? 'contained' : 'text'}
          color="primary"
          style={{ marginBottom: '10px', width: '100%' }}
        >
          Exporter configuration
        </Button>
        <Button
          onClick={() => handleModeChange('group')} // Activer le mode de regroupement
          variant={mode === 'group' ? 'contained' : 'text'} // Mettre en surbrillance le bouton lorsque le mode de regroupement est activé
          color="primary"
          style={{ marginBottom: '10px', width: '100%' }}
        >
          Regrouper les AS
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
        {groupingShapes.map((shape, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: shape[0].x,
              top: shape[0].y,
              width: Math.abs(shape[1].x - shape[0].x),
              height: Math.abs(shape[1].y - shape[0].y),
              border: '2px dashed blue', // Styling de la forme de regroupement
              pointerEvents: 'none', // Empêcher l'interaction avec la forme de regroupement
              zIndex: 999 // Assurez-vous que la forme de regroupement est au-dessus des routeurs
            }}
          ></div>
        ))}
        <canvas
          id="canvas"
          width={window.innerWidth - 250}
          height={window.innerHeight - 50}
          style={{ border: '2px solid black', margin: '20px' }}
        ></canvas>
      </div>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Tu veux configurer avec quoi ?</DialogTitle>
        <DialogContent>
          <Button onClick={() => {
            setConfiguration('RIP');
            setShowDialog(false);
          }}>RIP</Button>
          <Button onClick={() => {
            setConfiguration('OSPF');
            setShowDialog(false);
          }}>OSPF</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {configuration && (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px', backgroundColor: 'white', padding: '10px', border: '1px solid black', borderRadius: '5px' }}>
          Les routeurs sont connectés via {configuration}
        </div>
      )}
    </div>
  );
}

export default App;
