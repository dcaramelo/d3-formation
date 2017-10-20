'use strict';

const svg = d3.select('svg')
const margin = {top: 100, right: 100, bottom: 100, left: 100}
const width = +parseInt(svg.style('width'), 10) - margin.left - margin.right
const height = +parseInt(svg.style('height'), 10) - margin.top - margin.bottom
const g = svg.append('g').classed('global', true).attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const formatTime = d3.timeFormat('%d %b')

let dateMin

d3.select('button#next').on('click', () => {
  dateMin = d3.timeDay.offset(dateMin, 1)
  drawChart(svg.datum(), dateMin)
})

d3.select('button#previous').on('click', () => {
  dateMin = d3.timeDay.offset(dateMin, -1)
  drawChart(svg.datum(), dateMin)
})

d3.csv('csv/ventes.csv', (data) => {
  svg.datum(data)
  drawChart(svg.datum())
})

function drawChart(data, datestart) {
  let dates = []
  if (datestart === undefined) {
    data.forEach((d) => dates.push(new Date(d.day)))
    dateMin = dates[0]
    datestart = dates[0]
  }

  const dMin = d3.timeDay.offset(datestart, -1)
  const dMax = d3.timeDay.offset(dMin, 8)
  const displayedData = data.filter((d) => new Date(d.day) > dMin && new Date(d.day) < dMax)
  const displayedDate = displayedData.filter((d, i) => i % 2 === 0).map((d) => new Date(d.day))

  const y = d3.scaleLinear()
    .domain([0, 3000])
    .range([height, 0])
  const yAxis = d3.axisRight().scale(y)
    .tickValues([0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000])
    .tickSize(height)

  const x = d3.scaleTime()
    .domain([dMin, dMax])
    .range([0, width])
  const xAxis = d3.axisBottom().scale(x)
    .tickSize(width * -1)
    .tickValues(displayedDate)
    .tickFormat(formatTime)

  svg.select('g.global').remove()
  const g = svg.append('g').classed('global', true).attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('.tick line').attr('stroke', '#777').attr('stroke-dasharray', '1')

  g.append('g')
    .call(yAxis)
    .selectAll('.tick:not(:first-of-type) line').attr('stroke', '#777').attr('stroke-dasharray', '2')

  const boxes = g.selectAll('g.box')
    .data(displayedData)
    .enter()
    .append('g').classed('box', true)

  boxes.each(/* @this d3Element */ function(displayedData) {
    const box = d3.select(this)
    const yMin = y(displayedData.min) - y(displayedData.median)
    const yMax = y(displayedData.max) - y(displayedData.median)
    const yQ3 = y(displayedData.q3) - y(displayedData.median)
    const yQ1 = y(displayedData.q1) - y(displayedData.median)
    const length = yQ1 - yQ3

    box.attr('transform', `translate(${x(new Date(displayedData.day))}, ${y(displayedData.median)})`)
    box.append('line').classed('min', true)
      .attr('x1', -10)
      .attr('y1', 0)
      .attr('x2', 10)
      .attr('y2', 0)
      .style('stroke', 'black')
      .style('stroke-width', '4px')
      .transition()
      .duration(2000)
      .ease(d3.easePolyOut)
      .attr('y1', yMin)
      .attr('y2', yMin)
    box.append('line').classed('max', true)
      .attr('x1', '-10')
      .attr('y1', 0)
      .attr('x2', '10')
      .attr('y2', 0)
      .style('stroke', 'black')
      .style('stroke-width', '4px')
      .transition()
      .duration(2000)
      .ease(d3.easePolyOut)
      .attr('y1', yMax)
      .attr('y2', yMax)
    box.append('line').classed('min-max', true)
      .attr('x1', '0')
      .attr('y1', 0)
      .attr('x2', '0')
      .attr('y2', 0)
      .style('stroke', 'black')
      .style('stroke-width', '4px')
      .transition()
      .duration(2000)
      .ease(d3.easePolyOut)
      .attr('y1', yMax)
      .attr('y2', yMin)
    box.append('rect').classed('q1q3', true)
      .style('stroke', 'black')
      .style('fill', 'white')
      .style('stroke-width', '0.5px')
      .attr('x', '-10')
      .attr('y', 0)
      .attr('width', '20')
      .attr('height', 0)
      .transition()
      .duration(2000)
      .ease(d3.easePolyOut)
      .attr('y', yQ3)
      .attr('height', length)
    box.append('line').classed('median', true)
      .attr('x1', '-10')
      .attr('y1', '0')
      .attr('x2', '10')
      .attr('y2', '0')
      .style('stroke', 'darkgray')
      .style('stroke-width', '4px')
  })
}
