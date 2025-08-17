// Mock data for levels and pieces
export const LEVELS = {
  1: {
    description: "Welcome! Place all pieces to complete the level.",
    obstacles: [
      [2, 2], [2, 7], [7, 2], [7, 7]  // Four corner obstacles
    ],
    pieces: [
      {
        id: 1,
        shape: [
          [1, 1, 0],
          [0, 1, 0],
          [0, 1, 0]
        ]
      },
      {
        id: 2,
        shape: [
          [1, 1, 1],
          [1, 0, 0],
          [0, 0, 0]
        ]
      },
      {
        id: 3,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ]
      }
    ]
  },
  
  2: {
    description: "More challenging! Navigate around the obstacles.",
    obstacles: [
      [1, 4], [1, 5], [1, 6],
      [4, 1], [4, 2], [4, 8], [4, 9],
      [8, 3], [8, 4], [8, 5], [8, 6]
    ],
    pieces: [
      {
        id: 1,
        shape: [
          [1, 1, 0],
          [1, 1, 0],
          [0, 0, 0]
        ]
      },
      {
        id: 2,
        shape: [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0]
        ]
      },
      {
        id: 3,
        shape: [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0]
        ]
      },
      {
        id: 4,
        shape: [
          [1, 1, 1],
          [0, 1, 0],
          [0, 1, 0]
        ]
      }
    ]
  },
  
  3: {
    description: "Expert level! Complex patterns and tight spaces.",
    obstacles: [
      [0, 4], [0, 5],
      [2, 2], [2, 3], [2, 6], [2, 7],
      [4, 0], [4, 9],
      [5, 0], [5, 9],
      [7, 2], [7, 3], [7, 6], [7, 7],
      [9, 4], [9, 5]
    ],
    pieces: [
      {
        id: 1,
        shape: [
          [1, 1, 1],
          [1, 0, 0],
          [1, 0, 0]
        ]
      },
      {
        id: 2,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 1, 0]
        ]
      },
      {
        id: 3,
        shape: [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 1]
        ]
      },
      {
        id: 4,
        shape: [
          [1, 0, 1],
          [1, 1, 1],
          [0, 0, 0]
        ]
      },
      {
        id: 5,
        shape: [
          [1, 1, 0],
          [1, 0, 0],
          [1, 0, 0]
        ]
      }
    ]
  }
};