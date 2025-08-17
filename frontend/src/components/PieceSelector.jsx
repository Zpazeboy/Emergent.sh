import React from 'react';
import { Button } from './ui/button';

const PieceSelector = ({ pieces, selectedPiece, onPieceSelect, rotation, getRotatedPiece }) => {
  const renderPiece = (piece, index) => {
    const isSelected = selectedPiece === index;
    const displayPiece = isSelected ? getRotatedPiece(piece.shape, rotation) : piece.shape;
    
    return (
      <div
        key={piece.id}
        className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
            : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
        }`}
        onClick={() => onPieceSelect(index)}
      >
        <div className="flex flex-col items-center gap-2">
          {/* Piece Grid */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${displayPiece[0].length}, 1fr)` }}>
            {displayPiece.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-6 h-6 border ${
                    cell === 1 
                      ? 'bg-blue-400 border-blue-600' 
                      : 'bg-gray-100 border-gray-200 opacity-30'
                  }`}
                />
              ))
            )}
          </div>
          
          {/* Piece Info */}
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-600">
              Piece {piece.id}
            </div>
            {isSelected && (
              <div className="text-xs text-blue-600 mt-1">
                Rotation: {rotation * 90}°
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (pieces.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-2xl font-bold text-green-600 mb-2">🎉 Level Complete!</div>
        <p className="text-gray-600">All pieces have been successfully placed!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Pieces</h3>
        <p className="text-sm text-gray-600">
          Click to select a piece, then click on the grid to place it
        </p>
        {selectedPiece !== null && (
          <p className="text-sm text-blue-600 mt-2 font-medium">
            Selected: Piece {pieces[selectedPiece]?.id} (Click rotate button to turn)
          </p>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {pieces.map((piece, index) => renderPiece(piece, index))}
      </div>
    </div>
  );
};

export default PieceSelector;