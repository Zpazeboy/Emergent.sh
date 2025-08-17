import React from 'react';

const GameGrid = ({ gridState, onCellClick, onPieceClick, selectedPiece, canPlacePiece }) => {
  // Get preview of where piece would be placed
  const getPreviewCells = (row, col) => {
    if (!selectedPiece) return [];
    
    const previewCells = [];
    for (let i = 0; i < selectedPiece.length; i++) {
      for (let j = 0; j < selectedPiece[i].length; j++) {
        if (selectedPiece[i][j] === 1) {
          const previewRow = row + i;
          const previewCol = col + j;
          if (previewRow >= 0 && previewRow < 10 && previewCol >= 0 && previewCol < 10) {
            previewCells.push(`${previewRow}-${previewCol}`);
          }
        }
      }
    }
    return previewCells;
  };

  const [hoveredCell, setHoveredCell] = React.useState(null);
  const previewCells = hoveredCell ? getPreviewCells(hoveredCell.row, hoveredCell.col) : [];
  const canPlace = hoveredCell && selectedPiece ? canPlacePiece(selectedPiece, hoveredCell.row, hoveredCell.col) : false;

  const handleCellClick = (row, col, cellValue) => {
    if (cellValue && cellValue.startsWith('piece-')) {
      // Click on placed piece - remove it
      onPieceClick(row, col);
    } else if (!cellValue || cellValue !== 'obstacle') {
      // Click on empty cell - try to place piece
      onCellClick(row, col);
    }
  };

  const getCellStyle = (row, col, cellValue) => {
    const cellKey = `${row}-${col}`;
    const isPreview = previewCells.includes(cellKey);
    
    // Base styles - responsive sizing
    let baseStyle = "w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-bold touch-manipulation";
    
    if (cellValue === 'obstacle') {
      return `${baseStyle} bg-gray-800 cursor-not-allowed`;
    }
    
    if (cellValue && cellValue.startsWith('piece-')) {
      // Extract piece ID and assign color
      const pieceId = cellValue.split('-')[1];
      const colors = [
        'bg-red-400 hover:bg-red-500', 'bg-blue-400 hover:bg-blue-500', 'bg-green-400 hover:bg-green-500', 'bg-yellow-400 hover:bg-yellow-500', 
        'bg-purple-400 hover:bg-purple-500', 'bg-pink-400 hover:bg-pink-500', 'bg-indigo-400 hover:bg-indigo-500', 'bg-teal-400 hover:bg-teal-500'
      ];
      const colorIndex = parseInt(pieceId) % colors.length;
      return `${baseStyle} ${colors[colorIndex]} border-gray-600 cursor-move ring-2 ring-offset-1 ring-transparent hover:ring-gray-400 active:ring-gray-600`;
    }
    
    if (isPreview) {
      if (canPlace) {
        return `${baseStyle} bg-green-200 border-green-400 border-2`;
      } else {
        return `${baseStyle} bg-red-200 border-red-400 border-2`;
      }
    }
    
    return `${baseStyle} bg-white hover:bg-gray-50 active:bg-gray-100`;
  };

  return (
    <div className="inline-block p-2 sm:p-4 bg-white rounded-xl shadow-lg border-2 border-gray-200 touch-manipulation">
      <div className="mb-2 text-center">
        <p className="text-xs sm:text-sm text-gray-600">
          💡 Click pieces to move them back to spinner
        </p>
      </div>
      <div className="grid grid-cols-10 gap-0.5 sm:gap-1">
        {gridState.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellStyle(rowIndex, colIndex, cell)}
              onClick={() => handleCellClick(rowIndex, colIndex, cell)}
              onMouseEnter={() => !cell || cell === 'obstacle' ? setHoveredCell({ row: rowIndex, col: colIndex }) : null}
              onMouseLeave={() => setHoveredCell(null)}
              onTouchStart={() => !cell || cell === 'obstacle' ? setHoveredCell({ row: rowIndex, col: colIndex }) : null}
              onTouchEnd={() => setHoveredCell(null)}
            >
              {cell === 'obstacle' && <span className="text-xs sm:text-sm">⬛</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameGrid;