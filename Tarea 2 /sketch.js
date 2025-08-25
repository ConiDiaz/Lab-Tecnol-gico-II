import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const cities = [
    {name:"Amieirinha",population:4812946},
    {name:"Kinshasa",population:1027499},
    {name:"Blantyre",population:1992831},
    {name:"Pueblo Nuevo Viñas",population:6106658},
    {name:"Ko Si Chang",population:1258350},
    {name:"Rabak",population:5611054},
    {name:"Port-Cartier",population:2014142},
    {name:"Detroit",population:8927289},
    {name:"Medeiros Neto",population:6847563},
    {name:"Kushchëvskaya",population:4160962}
]

// Cree constantes para la altura de las barras
const baseLine = 300 // Me define la altura de la base donde empiezan las barras
const maxHeight = 1000 // Me define la altura máxima de las barras

d3.select('.bars')
    .selectAll('rect')
    .data(cities)
    .join('rect')
    .attr('x', (d, i) => i * 60) // Es la separación horizontal entre las barras (60 px a la derecha)
    .attr('y', d => baseLine - d.population * 30e-6) // Hace que crezcan hacia arriba desde la base (30e-6 es la altura proporcional de la población)
    .attr('width', 50) // Ancho de cada barra (50px)
    .attr('height', d => d.population * 30e-6) // Es la altura proporcional

d3.select('.labels')
    .selectAll('text')
    .data(cities)
    .join('text')
    .attr('x', (d, i) => i * 60 + 25) // Marca el centro de la barra (60 es la misma separación, +25 es la mitad del ancho de la barra)
    .attr('y', baseLine + 20) // De la linea de base va debajo 20 px de las barras
    .attr('text-anchor', 'start') // Desde donde comienza el texto en este caso el start me coincide con el x
    .attr('transform', (d, i) => `rotate(45, ${i*60+25}, ${baseLine+20})`) // Me permite rotar la informacion y que se adapten
    .text(d => d.name)
