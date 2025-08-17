import React from 'react';

const GameGrid = ({ gridState, onCellClick, selectedPiece, canPlacePiece }) => {
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

  const getCellStyle = (row, col, cellValue) => {
    const cellKey = `${row}-${col}`;
    const isPreview = previewCells.includes(cellKey);
    
    // Base styles
    let baseStyle = "w-8 h-8 border border-gray-300 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-bold";
    
    if (cellValue === 'obstacle') {
      return `${baseStyle} bg-gray-800 cursor-not-allowed`;
    }
    
    if (cellValue && cellValue.startsWith('piece-')) {
      // Extract piece ID and assign color
      const pieceId = cellValue.split('-')[1];
      const colors = [
        'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 
        'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-teal-400'
      ];
      const colorIndex = parseInt(pieceId) % colors.length;
      return `${baseStyle} ${colors[colorIndex]} border-gray-600`;
    }
    
    if (isPreview) {
      if (canPlace) {
        return `${baseStyle} bg-green-200 border-green-400 border-2`;
      } else {
        return `${baseStyle} bg-red-200 border-red-400 border-2`;
      }
    }
    
    return `${baseStyle} bg-white hover:bg-gray-50`;
  };

  return (
    <div className="inline-block p-4 bg-white rounded-xl shadow-lg border-2 border-gray-200">
      <div className="grid grid-cols-10 gap-1">
        {gridState.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellStyle(rowIndex, colIndex, cell)}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {cell === 'obstacle' && '⬛'}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameGrid;