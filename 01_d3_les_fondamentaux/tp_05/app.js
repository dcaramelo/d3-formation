'use strict'
const body = d3.select('body')
const svg = body.select('svg')

d3.json('json/villes.json', (data) => {
  const maxPopulation  = d3.max(data, (ville) => ville.population)
  const minPopulation  = d3.min(data, (ville) => ville.population)
  const maxRang        = d3.max(data, (ville) => ville.rang)
  const minRang        = d3.min(data, (ville) => ville.rang)
  const maxSuperficie  = d3.max(data, (ville) => ville.superficie)
  const minSuperficie  = d3.min(data, (ville) => ville.superficie)
  const rampPopulation = d3.scaleLinear().domain([minPopulation, maxPopulation]).range([20, 40])
  const rampRang       = d3.scaleLinear().domain([minRang, maxRang]).range([10, 40])
  const rampSuperficie = d3.scaleLinear().domain([minSuperficie, maxSuperficie]).range([10, 40])

  data.forEach((v, i) => {
    const g = svg.append('g')

    const c = g.append('circle')
      .attr('cy', -100)
      .attr('cx', 50 * (i + 1))
      .attr('r', rampPopulation(v.population))
      .style('fill', 'red')

    c.on('mouseenter', () => {
      c.style('fill', 'blue')
    }).on('mouseleave', () => {
      c.style('fill', 'red')
    }).on('click', () => {
      d3.selectAll('td.data')
        .data(d3.values(v))
        .text((l) => l)
    })
    g.append('text')
      .attr('y', -20)
      .attr('x', 50 * (1 + i))
      .style('text-anchor', 'middle')
      .html(v.nom)

    g.attr('transform', `translate(${(i) * 50}, 0)`)
      .transition()
      .delay(500 * (1 + i))
      .duration(500)
      .ease(d3.easeCubic)
      .attr('transform', `translate(${(i) * 50}, 200)`)
  })

  d3.text('partials/detail.html', (data) => {
    body.append('div').html(data)
    body.append('div').append('button')
      .attr('type', 'button')
      .html('rang')
      .on('click', () => updateRang())
    body.append('div').append('button')
      .attr('type', 'button')
      .html('population')
      .on('click', () => updatePopulation())
    body.append('div').append('button')
      .attr('type', 'button')
      .html('superficie')
      .on('click', () => updateSuperficie())
  })
  function updateRang() {
    svg.selectAll('circle')
      .data(data)
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr('r', (d) => rampRang(d.rang))
  }
  function updatePopulation() {
    svg.selectAll('circle')
      .data(data)
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr('r', (d) => rampPopulation(d.population))
  }
  function updateSuperficie() {
    svg.selectAll('circle')
      .data(data)
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr('r', (d) => rampSuperficie(d.superficie))
  }
})
