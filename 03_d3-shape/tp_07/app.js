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
const y1AxisHeight = '400'
const y2AxisHeight = '200'
const xOffset = '10'
const yOffset = '20'

let min

const drawChart = (datum, firstDay) => {
  svg.select('g.global').remove()
  const globalG = svg.append('g').classed('global', true)
  globalG.attr('transform', `translate(${xOffset}, ${yOffset})`)

  const data = datum.filter((data) => {
    return (
      parseTime(data.day) >= firstDay &&
      parseTime(data.day) <= d3.timeDay.offset(firstDay, 6)
    )
  })

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

  const y1Scale = d3.scaleLinear().domain([0, 2000]).range([parseInt(y1AxisHeight), 0])
  const y1Axis = d3.axisRight()
    .scale(y1Scale)
    .tickValues([0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000])
    .tickSize(parseInt(yTickSize) * -1)
    .tickPadding(10)
  globalG.append('g').classed('y1Axis', true).call(y1Axis)
  d3.selectAll('g.y1Axis g.tick line').attr('stroke-dasharray', '1, 1')
  d3.select('g.y1Axis').attr('transform', `translate(${yTickSize}, ${y2AxisHeight})`)

  const y2Scale = d3.scaleLinear().domain([0, 2000]).range([parseInt(y2AxisHeight), 0])
  const y2Axis = d3.axisRight()
    .scale(y2Scale)
    .tickValues([1000, 2000])
    .tickFormat((e) => e === 1000 ? '10%' : '20%')
    .tickSize(parseInt(yTickSize) * -1)
    .tickPadding(10)
  globalG.append('g').classed('y2Axis', true).call(y2Axis)
  d3.selectAll('g.y2Axis g.tick line').attr('stroke-dasharray', '1, 1')
  d3.select('g.y2Axis').attr('transform', `translate(${yTickSize}, 0)`)

  const boxes = globalG.selectAll('g.box')
    .data(data)
    .enter()
    .append('g').classed('box', true)
    .attr('transform', (d) => {
      return `translate(${xScale(parseTime(d.day))}, ${parseInt(y1Scale(d.median)) + parseInt(y2AxisHeight)})`
    })

  boxes.each(/* @this d3Element */ function(data) {
    const box = d3.select(this)
    const yMedian = y1Scale(parseInt(data.median))
    const yMin = y1Scale(parseInt(data.min))
    const yMax = y1Scale(parseInt(data.max))
    const yQ1 = y1Scale(parseInt(data.q1))
    const yQ3 = y1Scale(parseInt(data.q3))
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
      .attr('y', '-2')
      .attr('width', '20')
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

  const myLineTop = d3.line()
    .x((d) => xScale(parseTime(d.day)))
    .y((d) => y2Scale(d.median))
    .curve(d3.curveLinear)

  globalG.append('path').classed('myLineTop', true)
    .attr('d', myLineTop(data))
    .style('fill', 'none')
    .style('stroke', 'url(#myGradient)')

  const myLineBottom = d3.line()
    .x((d) => xScale(parseTime(d.day)))
    .y((d) => y1Scale(d.median) + parseInt(y2AxisHeight))
    .curve(d3.curveNatural)

  globalG.append('path').classed('myLineBottom', true)
    .attr('d', myLineBottom(data))
    .style('fill', 'none')
    .style('stroke', 'red')

  globalG.selectAll('path.symSquare')
    .data(data)
    .enter()
    .append('path').classed('symSquare', true)
    .attr('d', d3.symbol().type(d3.symbolSquare))
    .attr('transform', (d) => `translate(${xScale(parseTime(d.day))}, ${y2Scale(d.median)}) scale(0.7)`)

  globalG.selectAll('path.symCircle')
    .data(data)
    .enter()
    .append('path').classed('symCircle', true)
    .attr('d', d3.symbol().type(d3.symbolCircle))
    .attr('transform', (d) => `translate(${xScale(parseTime(d.day))}, ${y1Scale(d.median) + parseInt(y2AxisHeight)}) scale(0.5)`)

  const focus = globalG.append('g').classed('focus', true)
  focus.append('rect').classed('focusLine', true)
    .style('fill', 'url(#myGradient3)')
    .attr('x', '-1').attr('y', '0')
    .attr('width', '2').attr('height', xTickSize)
  focus.append('rect').classed('focusRectangle', true)
    .style('fill', 'url(#myGradient2)')
    .style('stroke', 'black')
    .attr('x', '-10')
    .attr('y', '-2')
    .attr('width', '20')
    .attr('height', '4')
  focus.append('path').classed('focusCircle', true)
    .attr('d', d3.symbol().type(d3.symbolCircle))
    .style('fill', 'green')
    .attr('transforme', 'scale(2)')
  focus.style('display', 'none')

  const mouseZone = globalG.append('rect').classed('mouseZone', true)
    .style('fill', 'orange')
    .style('fill-opacity', '0')
    // .style('pointer-events', 'all')
    .attr('x', '0')
    .attr('y', '0')
    .attr('width', parseInt(yTickSize) + 1)
    .attr('height', parseInt(xTickSize) + 1)

  mouseZone
    .on('mouseenter', () => focus.style('display', 'block'))
    .on('mouseleave', () => focus.style('display', 'none'))
    .on('mousemove', /* @this d3Element */ function() {
      const mouseCoords = d3.mouse(this)
      const selectedDay = (xScale.invert(mouseCoords[0])).getDate()
      const datum = data.filter((e) => new Date(e.day).getDate() === selectedDay)[0]

      if (datum) {
        const rectY = parseInt(y1Scale(datum.q3)) + parseInt(y2AxisHeight)
        const rectHeight = parseInt(y1Scale(datum.q1)) + parseInt(y2AxisHeight) - rectY

        focus
          .attr('transform', `translate(${xScale(parseTime(datum.day))}, 0)`)
        focus.select('rect.focusRectangle')
          .attr('y', rectY)
          .attr('height', rectHeight)
        focus.select('path.focusCircle')
          .attr('transform', `translate(0, ${y2Scale(datum.median)}) scale(2)`)
      }
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
