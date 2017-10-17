'use strict'

const svg = d3.select('body').select('svg')

const bounceNext = (current) => {
  const nextVille = current + 1

  d3.select(`g.ville-${current}`)
    .transition()
    .delay(50)
    .duration(600)
    .ease(d3.easePolyOut)
    .attr('transform', `translate(${current * 100}, 400)`)
    .on('end', () => bounceNext(nextVille))
}

d3.json('json/villes.json', (data) => {
  const minMax = d3.extent(data, (ville) => ville.population)
  const ramp = d3.scaleLinear().domain(minMax).range([40, 50])

  data.forEach((ville, i) => {
    svg.append('g').classed(`ville-${i}`, true)

    d3.select(`g.ville-${i}`).append('circle')
      .attr('cx', 50)
      .attr('cy', -200)
      .attr('r', ramp(ville.population))
      .style('fill', 'red')

    d3.select(`g.ville-${i}`).append('text').text(ville.nom)
      .attr('x', 50)
      .attr('y', -135)
      .style('text-anchor', 'middle')

    d3.select(`g.ville-${i}`).attr('transform', `translate(${i * 100}, 20)`)
  })

  bounceNext(0)
})
