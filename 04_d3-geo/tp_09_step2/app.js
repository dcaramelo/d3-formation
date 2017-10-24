'use strict';

d3.select('body').style('position', 'relative')

d3.json('geojson/regions.geojson', (countries) => {
  const projection = d3.geoMercator().center([2.590524, 49.079655]).scale(3000)
  const geoPath = d3.geoPath().projection(projection)
  const graticule = d3.geoGraticule()

  const minMax = d3.extent(countries.features, (d) => parseInt(d.properties.code))
  const colorScale = d3.scaleLinear().domain(minMax).range(['#FFF', '#000'])

  const g = d3.select('svg').append('g')

  g.append('path')
    .datum(graticule)
    .attr('d', geoPath)
    .style('fill', 'none')
    .style('stroke', 'lightgray')
    .style('stroke-width', '1px')

  g.selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'regions')
    .style('fill', (d) => colorScale(d.properties.code))
    .on('mouseenter', /* @this d3Element */ function(d) {
      d3.select(this).style('fill', 'red')
      d3.select('svg').append('circle').classed('center', true)
        .attr('r', 4)
        .attr('cx', () => geoPath.centroid(d)[0])
        .attr('cy', () => geoPath.centroid(d)[1])
        .style('fill', 'red')
        .style('stroke', 'white')
      d3.select('body').append('div').classed('tooltip', true)
        .style('position', 'absolute')
        .style('left', () => `${geoPath.centroid(d)[0]}px`)
        .style('top', () => `${geoPath.centroid(d)[1]}px`)
        .style('background', 'white')
        .style('padding', '5px')
        .style('border', '1px solid black')
        .text(() => d.properties.nom)
    })
    .on('mouseleave', /* @this d3Element */ function() {
      d3.select(this).style('fill', (d) => colorScale(d.properties.code))
      d3.select('circle.center').remove()
      d3.select('.tooltip').remove()
    })

  d3.json('json/villes.json', (dataCities) => {
    d3.select('svg').selectAll('circle')
      .data(dataCities)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', (d) => projection([d.x, d.y])[0])
      .attr('cy', (d) => projection([d.x, d.y])[1])
      .style('stroke', 'white')
  })
})
