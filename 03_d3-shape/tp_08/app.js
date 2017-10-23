'use strict'

const svg = d3.select('svg')
const margin = 100
const width = +parseInt(svg.style('width'), 10)
const height = +parseInt(svg.style('height'), 10)
const g = svg.append('g').classed('global', true).attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

d3.csv('csv/liste_des_prenoms_2004_a_2012.csv', (data) => {
  let countFemale = 0
  let countMale = 0
  data.forEach((d) => {
    if (d.sexe === 'F') {
      countFemale++
    } else {
      countMale++
    }
  })

  const dataChart = [{name: 'Male', color: '#98abc5', value: countMale}, {name: 'Female', color: '#8a89a6', value: countFemale}]

  const pieChart = d3.pie().value((d) => d.value)
  const myPie = pieChart(dataChart)
  const radius = Math.min(width, height) / 2

  const newArc = d3.arc()
    .outerRadius((radius) - margin)
    .innerRadius(((radius) / 4))

  const arcs = g.selectAll('g.slice')
    .data(myPie)
    .enter()
    .append('g')
    .attr('class', 'slice')

  arcs.append('path')
    .attr('d', newArc)
    .style('fill', (d) => d.data.color)
    .style('stroke', 'white')
    .style('stroke-width', '3px')
  arcs.append('text')
    .attr('transform', function(d) { return 'translate(' + newArc.centroid(d) + ')' })
    .style('fill', 'white')
    .text(function(d) { return d.data.name })
})
