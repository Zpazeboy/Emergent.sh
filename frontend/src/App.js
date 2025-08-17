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
  const [selectedPiece, setSelectedPiece] = useState(0); // Always have a selected piece
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

  // Rotate all pieces in spinner
  const rotateAllPieces = () => {
    setAvailablePieces(prevPieces => 
      prevPieces.map(piece => ({
        ...piece,
        shape: rotatePiece(piece.shape)
      }))
    );
    
    toast({
      title: "All pieces rotated! 🔄",
      description: "All pieces in the spinner have been rotated 90°",
      duration: 1500,
    });
  };

  // Handle piece selection from spinner
  const handlePieceSelect = (pieceIndex) => {
    setSelectedPiece(pieceIndex);
  };

  // Check if piece can be placed at position
  const canPlacePiece = useCallback((piece, row, col) => {
    for (let i = 0; i < piece.length; i++) {
      for (let j = 0; j < piece[i].length; j++) {
        if (piece[i][j] === 1) {
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
  }, [gridState]);

  // Handle piece placement on grid
  const handlePiecePlacement = (row, col) => {
    if (selectedPiece === null || !availablePieces[selectedPiece]) return;

    const piece = availablePieces[selectedPiece];

    if (canPlacePiece(piece.shape, row, col)) {
      const newGrid = gridState.map(row => [...row]);
      
      // Place the piece
      for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
          if (piece.shape[i][j] === 1) {
            newGrid[row + i][col + j] = `piece-${piece.id}`;
          }
        }
      }

      setGridState(newGrid);
      
      // Remove used piece from available pieces
      const newPieces = availablePieces.filter((_, index) => index !== selectedPiece);
      setAvailablePieces(newPieces);
      
      // Update selected piece index
      if (newPieces.length > 0) {
        setSelectedPiece(Math.min(selectedPiece, newPieces.length - 1));
      } else {
        setSelectedPiece(null);
      }

      // Check win condition
      if (newPieces.length === 0) {
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

  // Handle clicking on placed pieces to move them back to spinner
  const handlePieceRemoval = (row, col) => {
    const cellValue = gridState[row][col];
    if (!cellValue || !cellValue.startsWith('piece-')) return;

    const pieceId = cellValue.split('-')[1];
    const newGrid = gridState.map(row => [...row]);
    const pieceShape = [];
    
    // Find all cells belonging to this piece and extract the shape
    const pieceCells = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (newGrid[r][c] === cellValue) {
          pieceCells.push([r, c]);
          newGrid[r][c] = null; // Remove from grid
        }
      }
    }

    // Reconstruct the piece shape (this is simplified - assumes pieces maintain their original shape)
    // In a more complex implementation, you'd need to store the original shape data
    // For now, we'll find a matching shape from the original level pieces
    const originalPiece = LEVELS[currentLevel].pieces.find(p => p.id.toString() === pieceId);
    if (originalPiece) {
      // Add the piece back to available pieces
      const newPieces = [...availablePieces, { ...originalPiece }];
      setAvailablePieces(newPieces);
      setGridState(newGrid);
      setSelectedPiece(newPieces.length - 1); // Select the newly added piece
      
      toast({
        title: "Piece moved to spinner! ↩️",
        description: `Piece ${pieceId} has been moved back to the spinner`,
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
    setSelectedPiece(0);
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
      setSelectedPiece(0);
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
          
          {/* Always show rotate button */}
          <Button 
            onClick={rotateAllPieces} 
            size="sm"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
            disabled={availablePieces.length === 0}
          >
            <RotateCw size={14} />
            Rotate All Pieces
          </Button>
          
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
            onPieceClick={handlePieceRemoval}
            selectedPiece={selectedPiece !== null && availablePieces[selectedPiece] ? availablePieces[selectedPiece].shape : null}
            canPlacePiece={canPlacePiece}
          />
        </div>

        {/* Piece Selector */}
        <div className="px-2">
          <PieceSelector
            pieces={availablePieces}
            selectedPiece={selectedPiece}
            onPieceSelect={handlePieceSelect}
          />
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;