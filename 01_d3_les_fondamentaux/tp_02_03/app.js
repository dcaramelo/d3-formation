'use strict'

const svg = d3.select('body').append('svg')
  .style('width', '500px')
  .style('height', '600px')
  .style('border', '1px solid lightgray')

const gHead = svg.append('g').classed('head', true)
  .attr('transform', 'translate(50, 70)')

gHead.append('circle')
  .attr('r', '200')
  .attr('cx', '200')
  .attr('cy', '200')
  .style('fill', 'yellow')
  .style('stroke', 'black')

const gEyes = gHead.append('g').classed('eyes', true)
  .attr('transform', 'translate(125, -150)')

const tEyes = d3.transition()
  .delay(200)
  .duration(800)
  .ease(d3.easeBackOut)

gEyes.transition(tEyes)
  .attr('transform', 'translate(125, 125)')

gEyes.append('circle')
  .attr('r', '50')
  .attr('cx', '0')
  .attr('cy', '0')
  .style('fill', 'red')
  .style('stroke', 'black')
  .transition(tEyes)
  .style('fill', 'white')

gEyes.append('circle')
  .attr('r', '10')
  .attr('cx', '0')
  .attr('cy', '0')
  .style('fill', 'white')
  .transition(tEyes)
  .style('fill', 'black')

gEyes.append('circle')
  .attr('r', '50')
  .attr('cx', '150')
  .attr('cy', '0')
  .style('fill', 'red')
  .style('stroke', 'black')
  .transition(tEyes)
  .style('fill', 'white')

gEyes.append('circle')
  .attr('r', '10')
  .attr('cx', '150')
  .attr('cy', '0')
  .style('fill', 'white')
  .transition(tEyes)
  .style('fill', 'black')

const gNose = gHead.append('g').classed('nose', true)
  .attr('transform', 'translate(150, 205)')

gNose.append('polygon')
  .attr('points', '0,0 100,0 50,35')
  .style('fill', 'black')

const gMouth = gHead.append('g').classed('mouth', true)
  .attr('transform', 'translate(100, 270)')

gMouth.append('polygon')
  .attr('points', '0,0 200,0 200,20 0,20')
  .style('fill', 'black')

const initialTongueHeight = '40'
const finalTongueHeight = '80'

const tongue = gMouth.append('rect')
  .attr('x', '50')
  .attr('y', '20')
  .attr('width', '100')
  .attr('height', initialTongueHeight)
  .style('fill', 'pink')
  .style('stroke', 'black')

function tongueUp() {
  tongue.transition()
    .duration(500)
    .ease(d3.easeLinear)
    .attr('height', initialTongueHeight)
    .on('end', tongueDown)
}

function tongueDown() {
  tongue.transition()
    .duration(500)
    .ease(d3.easeLinear)
    .attr('height', finalTongueHeight)
    .on('end', tongueUp)
}

tongue.transition()
  .duration(500)
  .ease(d3.easeLinear)
  .attr('height', finalTongueHeight)
  .on('end', tongueUp)

svg.append('text')
  .attr('x', '-1000')
  .attr('y', '540')
  .style('font-size', '30px')
  .text(`Bonjour, je suis Fhou en SVG...`)
  .transition()
  .duration(2000)
  .attr('x', '50')
