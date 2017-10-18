'use strict'

const svg = d3.select('body svg')

d3.json('json/villes.json', (data) => {
  const max = d3.max(data, (ville) => ville.population)
  const min = d3.min(data, (ville) => ville.population)
  const ramp = d3.scaleLinear().domain([min, max]).range([20, 40])

  data.forEach((v, i) => {
    const g = svg.append('g')

    g.append('circle')
      .attr('cy', -100)
      .attr('cx', 50 * (i + 1))
      .attr('r', ramp(v.population))
      .style('fill', 'red')

    g.append('text')
      .attr('y', -20)
      .attr('x', 50 * (1 + i))
      .style('text-anchor', 'middle')
      .html(v.nom)

    g.attr('transform', `translate(${(i) * 50}, 0)`)
      .transition()
      .delay(1000 * (1 + i))
      .duration(1000)
      .ease(d3.easeCubic)
      .attr('transform', `translate(${(i) * 50}, 200)`)
  })
})

