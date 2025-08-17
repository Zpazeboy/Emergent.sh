import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PieceSelector = ({ pieces, selectedPiece, onPieceSelect }) => {
  const nextPiece = () => {
    onPieceSelect((selectedPiece + 1) % pieces.length);
  };

  const prevPiece = () => {
    onPieceSelect((selectedPiece - 1 + pieces.length) % pieces.length);
  };

  const renderPiece = (piece, position, isSelected = false) => {
    // Calculate styling based on position
    let scale = 'scale-50';
    let opacity = 'opacity-30';
    let zIndex = 'z-0';
    let translateY = 'translate-y-0';
    
    if (position === 0) {
      // Center piece (selected)
      scale = 'scale-100';
      opacity = 'opacity-100';
      zIndex = 'z-20';
      translateY = '-translate-y-2';
    } else if (Math.abs(position) === 1) {
      scale = 'scale-75';
      opacity = 'opacity-60';
      zIndex = 'z-10';
    } else if (Math.abs(position) === 2) {
      scale = 'scale-60';
      opacity = 'opacity-40';
      zIndex = 'z-5';
    }
    
    const sideOffset = position * 80; // Horizontal spacing
    const depthOffset = Math.abs(position) * 20; // Depth effect
    
    return (
      <div
        key={`${piece.id}-${position}`}
        className={`absolute transition-all duration-500 ease-out ${scale} ${opacity} ${zIndex} ${translateY} cursor-pointer`}
        style={{
          transform: `translateX(${sideOffset}px) translateY(${depthOffset}px)`,
        }}
        onClick={() => position === 0 ? null : onPieceSelect((selectedPiece + position + pieces.length) % pieces.length)}
      >
        <div className={`p-3 sm:p-4 border-2 rounded-xl transition-all duration-300 ${
          position === 0 
            ? 'border-blue-500 bg-blue-50 shadow-xl' 
            : 'border-gray-300 bg-white shadow-lg hover:border-blue-300 hover:shadow-xl'
        }`}>
          <div className="flex flex-col items-center gap-2">
            {/* Piece Grid */}
            <div className="grid gap-0.5 sm:gap-1" style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)` }}>
              {piece.shape.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border ${
                      cell === 1 
                        ? `${position === 0 ? 'bg-blue-400 border-blue-600' : 'bg-gray-400 border-gray-500'}` 
                        : 'bg-gray-100 border-gray-200 opacity-30'
                    }`}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (pieces.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2 sm:mb-3">🎉 Level Complete!</div>
        <p className="text-base sm:text-lg text-gray-600">All pieces have been successfully placed!</p>
      </div>
    );
  }

  // Create wheel arrangement - show up to 7 pieces (3 on each side + center)
  const getWheelPieces = () => {
    const wheelPieces = [];
    const range = Math.min(3, Math.floor(pieces.length / 2));
    
    for (let i = -range; i <= range; i++) {
      if (pieces.length === 1 && i !== 0) continue; // Don't show side pieces if only one piece
      
      const index = (selectedPiece + i + pieces.length) % pieces.length;
      wheelPieces.push({
        piece: pieces[index],
        index: index,
        position: i
      });
    }
    
    return wheelPieces;
  };

  const wheelPieces = getWheelPieces();

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 border-2 border-gray-200">
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Piece Wheel</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-1">
          Selected piece is at the top • Click side pieces to rotate wheel
        </p>
        <div className="text-xs sm:text-sm text-blue-600 font-medium">
          {pieces.length} pieces available
        </div>
      </div>
      
      {/* Wheel Container */}
      <div className="relative h-56 sm:h-72 flex items-center justify-center overflow-visible">
        {/* Navigation Arrows */}
        {pieces.length > 1 && (
          <>
            <Button
              onClick={prevPiece}
              variant="outline"
              size="sm"
              className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-30 rounded-full w-10 h-10 p-0 shadow-lg bg-white hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </Button>
            
            <Button
              onClick={nextPiece}
              variant="outline"
              size="sm"
              className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-30 rounded-full w-10 h-10 p-0 shadow-lg bg-white hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}

        {/* Wheel Pieces */}
        <div className="relative w-full h-full flex items-center justify-center">
          {wheelPieces.map(({ piece, index, position }) =>
            renderPiece(piece, position, index === selectedPiece)
          )}
        </div>
      </div>

      {/* Wheel Dots Indicator */}
      {pieces.length > 1 && (
        <div className="flex justify-center gap-1 sm:gap-2 mt-4">
          {pieces.map((_, index) => (
            <button
              key={index}
              onClick={() => onPieceSelect(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                index === selectedPiece
                  ? 'bg-blue-500 scale-125 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Enhanced Instructions */}
      <div className="text-center mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
          <div className="font-semibold text-blue-700">🎯 How to Play:</div>
          <div>• <strong>Place pieces:</strong> Click empty grid cells</div>
          <div>• <strong>Move pieces:</strong> Click placed pieces to return them to wheel</div>
          <div>• <strong>Rotate all pieces:</strong> Use the "Rotate All Pieces" button</div>
          <div>• <strong>Navigate wheel:</strong> Click arrows or side pieces</div>
        </div>
      </div>
    </div>
  );
};

export default PieceSelector;