'use strict'

const svg = d3.select('body').select('svg')

d3.text('partials/detail.html', (data) => d3.select('body').append('table').html(data))

const showCircle = (current) => {
  const nextVille = current + 1

  d3.select(`g.ville-${current}`)
    .transition()
    .delay(0)
    .duration(100)
    .ease(d3.easePolyOut)
    .attr('transform', `translate(${current * 100}, 400)`)
    .on('end', () => showCircle(nextVille))
}

const updateCircles = (data, key) => {
  const minMax = d3.extent(data, (ville) => ville[key])
  const ramp = d3.scaleLinear().domain(minMax).range([10, 50])

  const initCircles = svg.selectAll('g.ville circle').size() === 0
  let circleSelection

  if (initCircles) {
    circleSelection = svg.selectAll('g.ville').append('circle')
  } else {
    circleSelection = svg.selectAll('g.ville circle')
  }

  circleSelection
    .transition()
    .duration(initCircles ? 0 : 1500)
    .ease(d3.easeElasticOut)
    .attr('cx', 50)
    .attr('cy', -200)
    .attr('r', (d) => ramp(d[key]))
    .style('fill', 'red')

  circleSelection
    .on('mouseenter', /* @this d3Element */ function() {
      d3.select(this).style('fill', 'blue')
    })
    .on('mouseleave', /* @this d3Element */ function() {
      d3.select(this).style('fill', 'red')
    })
    .on('click', function(d) {
      d3.selectAll('table tr td.data')
        .data(d3.values(d))
        .text((l) => l)
    })
}

d3.json('json/villes.json', (data) => {
  // bind data
  svg.selectAll('g.ville')
    .data(data)
    .enter()
    .append('g').attr('class', (d, i) => `ville ville-${i}`)

  // initial position on top
  svg.selectAll('g.ville')
    .attr('transform', (d, i) => `translate(${i * 100}, 20)`)

  // draw circles, radius is based on population by default
  updateCircles(data, 'population')

  // add city's name under circle
  svg.selectAll('g.ville')
    .append('text').text((d) => d.nom)
    .attr('x', 50)
    .attr('y', -120)
    .style('text-anchor', 'middle')

  // start bouncing circles
  showCircle(0)

  // add props buttons
  const props = d3.keys(data[0]).filter((e) => e !== 'nom')

  d3.select('body').append('div')
    .classed('buttons', true)
    .selectAll('button')
    .data(props)
    .enter()
    .append('button')
    .text((l) => l)
    .on('click', function(d) {
      updateCircles(data, d)
    })
})
