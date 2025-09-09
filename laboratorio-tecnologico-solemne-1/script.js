import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import data from './data.json' with {type: 'json'};

async function cargar() {
  const fields = ["_id","station_id","station_name","coordinates","altitude","year","month","day","temp_min","temp_max"];
  const records = data.records.map(r => Object.fromEntries(fields.map((f, i) => [f, r[i]])));
  const junio = records.filter(r => Number(r.month) === 6);

  const grupos = d3.rollup(
    junio,
    v => d3.max(v, d => +d.temp_max),
    d => d.station_name
  );

  const estaciones = Array.from(grupos.keys());
  const maximos = Array.from(grupos.values());

  const color = d3.scaleThreshold()
      const thresholds = [-5, 0, 5, 10, 15, 20, 25, 30]
  const stepColors = [
    "#00BFFF", "#1F90FF", "#00FA9A", "#7CFC00", "#FFFF00", "#FFA500", "#FF4500", "#FF0000"
  ];

  const svg = d3.select("#grafico");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const radius = Math.min(width, height) / 2 - 50;
  const g = svg.append("g").attr("transform", `translate(${width/2}, ${height/2})`);

  const bands = thresholds.length;
  const holeRadius = radius * 0.3;
  const stepSize = (radius - holeRadius) / bands; 

  estaciones.forEach((est, i) => {
    const angleStart = (i / estaciones.length) * 2 * Math.PI;
    const angleEnd   = ((i + 1) / estaciones.length) * 2 * Math.PI;
    const maxTemp = Math.min(maximos[i] ?? -Infinity, 30);

    for (let s = 0; s < bands; s++) {
      const threshold = thresholds[s]; 
      if (threshold <= maxTemp) {
        const arc = d3.arc()
          .innerRadius(holeRadius + s * stepSize)
          .outerRadius(holeRadius + (s + 1) * stepSize)
          .startAngle(angleStart)
          .endAngle(angleEnd);

        g.append("path")
          .attr("d", arc)
          .attr("fill", stepColors[s]);
      }
    }
  });

  for (let s = 1; s < bands; s++) {
    g.append("circle")
      .attr("r", holeRadius + s * stepSize)
      .attr("fill", "none")
      .attr("stroke", "#575756")
      .attr("stroke-width", 1);
  }

  estaciones.forEach((_, i) => {
    const angle = (i / estaciones.length) * 2 * Math.PI;
    const x1 = Math.cos(angle) * holeRadius;
    const y1 = Math.sin(angle) * holeRadius;
    const x2 = Math.cos(angle) * radius;
    const y2 = Math.sin(angle) * radius;

    g.append("line")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2)
      .attr("stroke", "#575756")
      .attr("stroke-width", 1);
  });

  g.selectAll("text")
    .data(estaciones)
    .enter()
    .append("text")
    .attr("transform", (d,i) => {
      const angle = (i / estaciones.length) * 2 * Math.PI - Math.PI/2;
      const x = Math.cos(angle) * (radius + -5);
      const y = Math.sin(angle) * (radius + -5);
      return `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`;
    })
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .style("font-size", "11px")
    .attr("fill", "white")
    .text(d => d);
}

cargar();
