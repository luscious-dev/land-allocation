// import * as d3 from "d3";

const map = document.getElementById("map");

const vertices = [
  [100, 100], // Vertex 1
  [400, 100], // Vertex 2
  [400, 400], // Vertex 3
  [200, 400], // Vertex 4
  [100, 200], // Vertex 5
];

// const vertices = JSON.parse(map.dataset.landBounds);
console.log(vertices);

// -----------------------
const landWidth = 100; // Width of the land in meters
const diagramWidth = 400; // Width of the diagram in pixels
const scaleLabelX = 20; // X-coordinate of the scale label
const scaleLabelY = 20; // Y-coordinate of the scale label

//   ---------------------

const svg = d3.select("svg");

const path = svg
  .append("path")
  .attr("d", d3.line()(vertices) + "Z")
  .attr("stroke", "black")
  .attr("fill", "none");

// Calculate the scale factor
const scaleFactor = diagramWidth / landWidth;

// Add scale label to the diagram
svg
  .append("text")
  .attr("x", scaleLabelX)
  .attr("y", scaleLabelY)
  .text(`Scale: 1 : ${scaleFactor.toFixed(0)}`);

// Calculate the length of each line segment
const lengths = [];
for (let i = 0; i < vertices.length - 1; i++) {
  const x1 = vertices[i][0];
  const y1 = vertices[i][1];
  const x2 = vertices[i + 1][0];
  const y2 = vertices[i + 1][1];
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  lengths.push(length);
}

// Add labels to the edges
const unit = "units"; // Specify the unit for the labels
for (let i = 0; i < lengths.length; i++) {
  const x1 = vertices[i][0];
  const y1 = vertices[i][1];
  const x2 = vertices[i + 1][0];
  const y2 = vertices[i + 1][1];
  const labelX = (x1 + x2) / 2;
  const labelY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const length = lengths[i].toFixed(2);

  let rotationAngle = angle; // Default rotation angle
  if (angle > 90 || angle < -90) {
    rotationAngle += 180; // Flip the label if the angle is outside the range [-90, 90]
  }

  svg
    .append("text")
    .attr("x", labelX)
    .attr("y", labelY)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr(
      "transform",
      `rotate(${rotationAngle}, ${labelX}, ${labelY}) translate(0, -10)`
    )
    .text(length + " " + unit);
}
