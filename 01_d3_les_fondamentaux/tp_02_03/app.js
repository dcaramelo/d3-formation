'use strict'

// svg
const svg = d3.select('body')
  .append('svg')
  .style('width', '500px')
  .style('height', '500px')
  .style('height', '500px')
  .style('border', '1px lightgray solid')

// Head
svg.append('circle')
  .attr('cy', 250)
  .attr('cx', 250)
  .attr('r', 175)
  .style('fill', 'blue')

// eyes group
const gEyes = svg.append('g')

gEyes.append('circle')
  .attr('cy', 175)
  .attr('cx', 175)
  .attr('r', 40)
  .style('fill', 'black')

gEyes.append('circle')
  .attr('cy', 175)
  .attr('cx', 325)
  .attr('r', 40)
  .style('fill', 'black')

// mouth
svg.append('rect')
  .attr('x', 150)
  .attr('y', 300)
  .attr('width', 200)
  .attr('height', 5)

// tongue
const tongue = svg.append('rect')
  .attr('x', 175)
  .attr('y', 305)
  .attr('width', 150)
  .attr('height', 1)
  .style('fill', 'pink')

function fTongueUp() {
  tongue.transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr('height', 1)
    .on('end', fTongueDown)
}

function fTongueDown() {
  tongue.transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr('height', 40)
    .on('end', fTongueUp)
}

tongue.transition()
  .duration(2000)
  .ease(d3.easeLinear)
  .attr('height', 40)
  .on('end', fTongueUp)

// transition text
const tText = d3.transition()
  .delay(1000)
  .duration(3000)
  .ease(d3.easeLinear)

// text
svg.append('text')
  .attr('x', 100)
  .attr('y', 550)
  .style('font-size', '46px')
  .html('Bonjour David !')
  .transition(tText)
  .attr('y', 475)
