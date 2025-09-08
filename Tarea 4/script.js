import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import data from './data.json' with {type: 'json'};

const projection = d3.geoMercator().fitSize([500, 500], data);
const path = d3.geoPath(projection);

const poblaciones = data.features.map(d => d.properties.poblacion);

const colorScale = d3.scaleSequential()
  .domain([d3.min(poblaciones), d3.max(poblaciones)])
  .interpolator(d3.interpolateLab("steelblue", "pink"));
  //steelblue menor cantidad de poblacion
  //pink mayor cantidad de poblacion

const mapa = d3.select('.mapa')
  .selectAll('path')
  .data(data.features)
  .join('path')
  .attr('d', path)
  .attr('fill', d => colorScale(d.properties.poblacion))
  .attr('stroke', '#000')
  .attr('stroke-width', 0.2)
  .attr('opacity', 1);

mapa.on('mouseover', function(event, d) {
  const original = d3.color(colorScale(d.properties.poblacion));
  d3.select(this).attr('fill', original.darker(1)); // Oscurece el color al pasar el mouse
})

.on('mouseout', function(event, d) {
  d3.select(this).attr('fill', colorScale(d.properties.poblacion));
