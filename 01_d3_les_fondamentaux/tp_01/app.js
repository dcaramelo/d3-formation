'use strict'

let max = Math.max(...villes.map(function(o) { return o.population }))

d3.select('body')
  .append('div').classed('chart', true)
  .selectAll('div')
  .data(villes)
  .enter().append('div').classed('line', true)

const lines = d3.selectAll('.line')

lines.append('div').classed('label', true)
  .text((d) => d.nom)

lines.append('div').classed('bar', true)
  .style('width', (d) => d.population / max * 50 + '%')
  .text((d) => d.population)
