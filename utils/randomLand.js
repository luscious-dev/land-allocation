// Function to generate random integer within a range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate random land shapes
function generateRandomLandShapes(numShapes) {
  const landShapes = [];

  for (let i = 0; i < numShapes; i++) {
    const numVertices = getRandomInt(3, 8); // Random number of vertices between 3 and 8
    const vertices = [];

    for (let j = 0; j < numVertices; j++) {
      const x = getRandomInt(50, 750); // Random x-coordinate between 50 and 750
      const y = getRandomInt(50, 550); // Random y-coordinate between 50 and 550
      vertices.push([x, y]);
    }

    landShapes.push(vertices);
  }

  return landShapes;
}

// Generate 10 random land shapes
const numShapes = 10;
const randomLandShapes = generateRandomLandShapes(numShapes);

console.log(randomLandShapes);
