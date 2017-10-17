'use strict'

const svg = d3.select('body svg')

const parseTime = d3.timeParse('%Y-%m-%d')
const formatTime = d3.timeFormat('%e %b')

const xTickValues = (minMax) => {
  const max = minMax[1]
  let min = d3.timeDay.offset(minMax[0], 1)
  let values = []
  for (min; min <= max; min = d3.timeDay.offset(min, 2)) {
    values.push(min)
  }
  return values
}

const xTickSize = '600'
const yTickSize = '740'
const xOffset = '10'
const yOffset = '20'

let min

const drawChart = (datum, firstDay) => {
  svg.select('g.global').remove()
  const globalG = svg.append('g').classed('global', true)
  globalG.attr('transform', `translate(${xOffset}, ${yOffset})`)

  const min = d3.timeDay.offset(firstDay, -1)
  const max = d3.timeDay.offset(min, 8)
  const minMax = [min, max]
  const xScale = d3.scaleTime().domain(minMax).range([0, parseInt(yTickSize)])
  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickValues(xTickValues(minMax))
    .tickFormat((date) => formatTime(date))
    .tickSize(parseInt(xTickSize) * -1)
    .tickPadding(10)
  globalG.append('g').classed('xAxis', true).call(xAxis)
  d3.select('g.xAxis path.domain').style('stroke-width', '1')
  d3.selectAll('g.xAxis g.tick line').attr('stroke-dasharray', '1, 1')
  d3.select('g.xAxis').attr('transform', `translate(0, ${xTickSize})`)

  const yScale = d3.scaleLinear().domain([0, 3000]).range([parseInt(xTickSize), 0])
  const yAxis = d3.axisRight()
    .scale(yScale)
    .tickValues([0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000])
    .tickSize(parseInt(yTickSize) * -1)
    .tickPadding(10)
  globalG.append('g').classed('yAxis', true).call(yAxis)
  d3.selectAll('g.yAxis g.tick line').attr('stroke-dasharray', '1, 1')
  d3.select('g.yAxis').attr('transform', `translate(${yTickSize}, 0)`)

  const data = datum.filter((data) => {
    return (
      parseTime(data.day) >= firstDay &&
      parseTime(data.day) <= d3.timeDay.offset(firstDay, 6)
    )
  })

  const boxes = globalG.selectAll('g.box')
    .data(data)
    .enter()
    .append('g').classed('box', true)
    .attr('transform', (d) => {
      return `translate(${xScale(parseTime(d.day))}, ${yScale(d.median)})`
    })

  boxes.each(/* @this d3Element */ function(data) {
    const box = d3.select(this)
    const yMedian = yScale(parseInt(data.median))
    const yMin = yScale(parseInt(data.min))
    const yMax = yScale(parseInt(data.max))
    const yQ1 = yScale(parseInt(data.q1))
    const yQ3 = yScale(parseInt(data.q3))
    const y1MinMax = yMax - yMedian
    const y2MinMax = yMin - yMedian
    const yQ1Q3 = yQ3 - yMedian
    const heightQ1Q3 = yQ1 - yQ3
    box.append('line').classed('minMax', true)
      .style('stroke', 'black')
      .style('stroke-width', '4px')
      .attr('x1', '0')
      .attr('x2', '0')
      .attr('y1', '0')
      .attr('y2', '0')
      .transition()
      .duration(1500)
      .ease(d3.easePolyOut)
      .attr('y1', y1MinMax)
      .attr('y2', y2MinMax)
    box.append('line').classed('max', true)
      .style('stroke', 'black')
      .style('stroke-width', '4px')
      .attr('x1', '-10')
      .attr('x2', '10')
      .attr('y1', '0')
      .attr('y2', '0')
      .transition()
      .duration(1500)
      .ease(d3.easePolyOut)
      .attr('y1', y1MinMax)
      .attr('y2', y1MinMax)
    box.append('line').classed('min', true)
      .style('stroke', 'black')
      .style('stroke-width', '4px')
      .attr('x1', '-10')
      .attr('x2', '10')
      .attr('y1', '0')
      .attr('y2', '0')
      .transition()
      .duration(1500)
      .ease(d3.easePolyOut)
      .attr('y1', y2MinMax)
      .attr('y2', y2MinMax)
    box.append('rect').classed('q1q3', true)
      .style('fill', 'white')
      .style('stroke', 'black')
      .attr('x', '-10')
      .attr('width', '20')
      .attr('y', '-2')
      .attr('height', '4')
      .transition()
      .duration(1500)
      .ease(d3.easePolyOut)
      .attr('y', yQ1Q3)
      .attr('height', heightQ1Q3)
    box.append('line').classed('median', true)
      .attr('x1', '-10').attr('y1', '0')
      .attr('x2', '10').attr('y2', '0')
      .style('stroke', 'darkgray')
      .style('stroke-width', '4px')
  })
}

d3.csv('csv/ventes.csv', (dataCSV) => {
  svg.datum(dataCSV)
  min = d3.min(dataCSV, (vente) => parseTime(vente.day))
  drawChart(svg.datum(), min)
})

d3.select('button#previous').on('click', () => {
  min = d3.timeDay.offset(min, -1)
  drawChart(svg.datum(), min)
})

d3.select('button#next').on('click', () => {
  min = d3.timeDay.offset(min, 1)
  drawChart(svg.datum(), min)
})
