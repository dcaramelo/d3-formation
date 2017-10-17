'use strict'

const maxPopulation = d3.max(villes, (v) => v.population)

const barWidth = (population) => `${population / maxPopulation * 1000}px`

const chart = d3.select('body')
  .append('div').classed('chart', true)

chart.selectAll('div.line')
  .data(villes)
  .enter().append('div').classed('line', true)

d3.selectAll('div.line')
  .append('div').classed('label', true)
  .text((d) => d.nom)

d3.selectAll('div.line')
  .append('div').classed('bar', true)
  .style('width', (d) => barWidth(d.population))
  .text((d) => d.population)
