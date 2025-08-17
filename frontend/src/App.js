import React, { useState, useCallback } from 'react';
import './App.css';
import GameGrid from './components/GameGrid';
import PieceSelector from './components/PieceSelector';
import { LEVELS } from './mockData';
import { Button } from './components/ui/button';
import { RotateCw, SkipForward, Home, Menu } from 'lucide-react';
import { useToast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gridState, setGridState] = useState(() => {
    // Initialize grid with level obstacles
    const level = LEVELS[currentLevel];
    const initialGrid = Array(10).fill().map(() => Array(10).fill(null));
    
    // Place obstacles from level map
    level.obstacles.forEach(([row, col]) => {
      initialGrid[row][col] = 'obstacle';
    });
    
    return initialGrid;
  });
  const [availablePieces, setAvailablePieces] = useState(() => [...LEVELS[currentLevel].pieces]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const { toast } = useToast();

  // Get current level data
  const currentLevelData = LEVELS[currentLevel];

  // Rotate piece 90 degrees clockwise
  const rotatePiece = useCallback((piece) => {
    const rotated = piece[0].map((_, index) =>
      piece.map(row => row[row.length - 1 - index])
    );
    return rotated;
  }, []);

  // Get rotated version of current piece
  const getRotatedPiece = useCallback((piece, rotations) => {
    let rotatedPiece = piece;
    for (let i = 0; i < rotations; i++) {
      rotatedPiece = rotatePiece(rotatedPiece);
    }
    return rotatedPiece;
  }, [rotatePiece]);

  // Handle piece selection
  const handlePieceSelect = (pieceIndex) => {
    setSelectedPiece(pieceIndex);
    setRotation(0);
  };

  // Handle piece rotation
  const handleRotation = () => {
    setRotation((prev) => (prev + 1) % 4);
  };

  // Check if piece can be placed at position
  const canPlacePiece = useCallback((piece, row, col) => {
    const rotatedPiece = getRotatedPiece(piece, rotation);
    
    for (let i = 0; i < rotatedPiece.length; i++) {
      for (let j = 0; j < rotatedPiece[i].length; j++) {
        if (rotatedPiece[i][j] === 1) {
          const newRow = row + i;
          const newCol = col + j;
          
          // Check bounds
          if (newRow >= 10 || newCol >= 10 || newRow < 0 || newCol < 0) {
            return false;
          }
          
          // Check if cell is already occupied
          if (gridState[newRow][newCol] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  }, [gridState, rotation, getRotatedPiece]);

  // Handle piece placement
  const handlePiecePlacement = (row, col) => {
    if (selectedPiece === null) return;

    const piece = availablePieces[selectedPiece];
    if (!piece) return;

    if (canPlacePiece(piece.shape, row, col)) {
      const rotatedPiece = getRotatedPiece(piece.shape, rotation);
      const newGrid = gridState.map(row => [...row]);
      
      // Place the piece
      for (let i = 0; i < rotatedPiece.length; i++) {
        for (let j = 0; j < rotatedPiece[i].length; j++) {
          if (rotatedPiece[i][j] === 1) {
            newGrid[row + i][col + j] = `piece-${piece.id}`;
          }
        }
      }

      setGridState(newGrid);
      
      // Remove used piece from available pieces
      setAvailablePieces(prev => prev.filter((_, index) => index !== selectedPiece));
      setSelectedPiece(null);
      setRotation(0);

      // Check win condition
      const remainingPieces = availablePieces.filter((_, index) => index !== selectedPiece);
      if (remainingPieces.length === 0) {
        toast({
          title: "Level Complete! 🎉",
          description: `You've successfully completed level ${currentLevel}!`,
          duration: 3000,
        });
      }
    } else {
      toast({
        title: "Invalid Placement",
        description: "This piece cannot be placed here.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Reset current level
  const resetLevel = () => {
    const level = LEVELS[currentLevel];
    const initialGrid = Array(10).fill().map(() => Array(10).fill(null));
    
    level.obstacles.forEach(([row, col]) => {
      initialGrid[row][col] = 'obstacle';
    });
    
    setGridState(initialGrid);
    setAvailablePieces([...level.pieces]);
    setSelectedPiece(null);
    setRotation(0);
    setShowControls(false);
  };

  // Go to next level
  const nextLevel = () => {
    const nextLevelNum = currentLevel + 1;
    if (LEVELS[nextLevelNum]) {
      setCurrentLevel(nextLevelNum);
      const level = LEVELS[nextLevelNum];
      const initialGrid = Array(10).fill().map(() => Array(10).fill(null));
      
      level.obstacles.forEach(([row, col]) => {
        initialGrid[row][col] = 'obstacle';
      });
      
      setGridState(initialGrid);
      setAvailablePieces([...level.pieces]);
      setSelectedPiece(null);
      setRotation(0);
      setShowControls(false);
      
      toast({
        title: "New Level!",
        description: `Welcome to level ${nextLevelNum}!`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">Grid Puzzle Master</h1>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
            <div className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base">
              Level {currentLevel}
            </div>
            <div className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg text-sm sm:text-base">
              Pieces Left: {availablePieces.length}
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base px-2">{currentLevelData.description}</p>
        </div>

        {/* Mobile Controls Toggle */}
        <div className="sm:hidden flex justify-center mb-4">
          <Button
            onClick={() => setShowControls(!showControls)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Menu size={16} />
            {showControls ? 'Hide Controls' : 'Show Controls'}
          </Button>
        </div>

        {/* Controls */}
        <div className={`flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap ${showControls ? 'block' : 'hidden sm:flex'}`}>
          <Button 
            onClick={resetLevel} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <Home size={14} />
            Reset Level
          </Button>
          
          {selectedPiece !== null && (
            <Button 
              onClick={handleRotation} 
              size="sm"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
            >
              <RotateCw size={14} />
              Rotate Piece
            </Button>
          )}
          
          {availablePieces.length === 0 && LEVELS[currentLevel + 1] && (
            <Button 
              onClick={nextLevel} 
              size="sm"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm"
            >
              <SkipForward size={14} />
              Next Level
            </Button>
          )}
        </div>

        {/* Game Grid */}
        <div className="flex justify-center mb-4 sm:mb-8 px-2">
          <GameGrid
            gridState={gridState}
            onCellClick={handlePiecePlacement}
            selectedPiece={selectedPiece !== null ? getRotatedPiece(availablePieces[selectedPiece]?.shape, rotation) : null}
            canPlacePiece={canPlacePiece}
          />
        </div>

        {/* Piece Selector */}
        <div className="px-2">
          <PieceSelector
            pieces={availablePieces}
            selectedPiece={selectedPiece}
            onPieceSelect={handlePieceSelect}
            rotation={rotation}
            getRotatedPiece={getRotatedPiece}
          />
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;