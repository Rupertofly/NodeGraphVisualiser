function setup() {
  let [wid, hei] = [180, 100];
  let svg = d3.select("#mySVG");
  let vor = d3.voronoi().size([wid, hei]);
  let sites = d3.range(64).map(() => [random(wid), random(hei)]);
  let polys = vor(sites).polygons();
  let dgram = vor(sites);
  for (let j = 0; j < 32; j++) {
    for (let [i, p] of polys.entries()) {
      sites[i] = d3.polygonCentroid(p);
    }
    polys = vor(sites).polygons();
    dgram = vor(sites);
  }
  let r = min(
    polys.map(p => {
      return getMinDist(p);
    })
  );
  let neighbours = d3.range(64).map(index => {
    let thisCell = dgram.cells[index];
    let thisEdges = thisCell.halfedges.map(e => {
      if (dgram.edges[e] === undefined) return;
      return dgram.edges[e];
    });
    let thisNeighbours = [];
    for (let edge of thisEdges) {
      // check which side
      let otherSide =
        edge.left.index === thisCell.site.index ? edge.right : edge.left;
      if (otherSide !== undefined && otherSide.index > thisCell.site.index)
        thisNeighbours.push(otherSide);
    }
    return thisNeighbours;
  });
  console.log(neighbours);
  for (let [i, n] of neighbours.entries()) {
    let [x1, y1] = dgram.cells[i].site;
    for (let s of n) {
      let [x2, y2] = s;
      if (random() < 0.4) continue;
      svg
        .append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke-width", 2)
        .attr("stroke", "black");
    }
  }

  polys.map(p => {
    let [x, y] = sites[polys.indexOf(p)];
    svg
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", r - 0.3);
  });
}
