import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PieceSelector = ({ pieces, selectedPiece, onPieceSelect, rotation, getRotatedPiece }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPiece = () => {
    setCurrentIndex((prev) => (prev + 1) % pieces.length);
  };

  const prevPiece = () => {
    setCurrentIndex((prev) => (prev - 1 + pieces.length) % pieces.length);
  };

  const selectCurrentPiece = () => {
    onPieceSelect(currentIndex);
  };

  const renderPiece = (piece, isCenter = false, isSelected = false) => {
    const displayPiece = isSelected ? getRotatedPiece(piece.shape, rotation) : piece.shape;
    const scale = isCenter ? 'scale-110' : 'scale-75';
    const opacity = isCenter ? 'opacity-100' : 'opacity-40';
    
    return (
      <div className={`transition-all duration-300 ${scale} ${opacity}`}>
        <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-xl' 
            : isCenter
            ? 'border-gray-400 bg-white shadow-lg hover:border-blue-300'
            : 'border-gray-200 bg-gray-50'
        }`}
        onClick={isCenter ? selectCurrentPiece : undefined}>
          <div className="flex flex-col items-center gap-3">
            {/* Piece Grid */}
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${displayPiece[0].length}, 1fr)` }}>
              {displayPiece.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-8 h-8 border ${
                      cell === 1 
                        ? `${isCenter ? 'bg-blue-400 border-blue-600' : 'bg-gray-400 border-gray-500'}` 
                        : 'bg-gray-100 border-gray-200 opacity-30'
                    }`}
                  />
                ))
              )}
            </div>
            
            {/* Piece Info */}
            {isCenter && (
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800">
                  Piece {piece.id}
                </div>
                {isSelected && (
                  <div className="text-xs text-blue-600 mt-1 font-medium">
                    Rotation: {rotation * 90}°
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Click to select
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (pieces.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-3xl font-bold text-green-600 mb-3">🎉 Level Complete!</div>
        <p className="text-lg text-gray-600">All pieces have been successfully placed!</p>
      </div>
    );
  }

  // Get pieces for spinner display
  const getSpinnerPieces = () => {
    const spinnerPieces = [];
    const totalPieces = pieces.length;
    
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + totalPieces) % totalPieces;
      spinnerPieces.push({
        piece: pieces[index],
        index: index,
        position: i
      });
    }
    
    return spinnerPieces;
  };

  const spinnerPieces = getSpinnerPieces();

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Piece Spinner</h3>
        <p className="text-sm text-gray-600 mb-1">
          Navigate through available pieces and click to select
        </p>
        <div className="text-sm text-blue-600 font-medium">
          {pieces.length} pieces remaining • Showing piece {currentIndex + 1} of {pieces.length}
        </div>
        
        {selectedPiece !== null && (
          <p className="text-sm text-green-600 mt-2 font-medium">
            ✓ Piece {pieces[selectedPiece]?.id} selected (Use rotate button to turn)
          </p>
        )}
      </div>
      
      {/* Spinner Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        <Button
          onClick={prevPiece}
          variant="outline"
          size="sm"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-10 h-10 p-0 shadow-lg bg-white hover:bg-gray-50"
        >
          <ChevronLeft size={20} />
        </Button>
        
        <Button
          onClick={nextPiece}
          variant="outline"
          size="sm"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-10 h-10 p-0 shadow-lg bg-white hover:bg-gray-50"
        >
          <ChevronRight size={20} />
        </Button>

        {/* Spinner Display */}
        <div className="flex items-center justify-center gap-2 py-4 px-16">
          {spinnerPieces.map(({ piece, index, position }) => (
            <div
              key={`${piece.id}-${position}`}
              className={`flex-shrink-0 transition-all duration-300 ${
                position === 0 ? 'z-10' : 'z-0'
              }`}
              style={{
                transform: `translateX(${position * 10}px)`,
              }}
            >
              {renderPiece(
                piece, 
                position === 0, 
                selectedPiece === index
              )}
            </div>
          ))}
        </div>

        {/* Spinner Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {pieces.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-blue-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Selection Hint */}
      <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500">
          💡 <strong>Pro Tip:</strong> Use arrow buttons or dots to navigate, then click the center piece to select it!
        </div>
      </div>
    </div>
  );
};

export default PieceSelector;