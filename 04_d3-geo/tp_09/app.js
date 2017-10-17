'use strict'

const geoMercator = d3.geoMercator().scale(2000).center([2.33333, 48.86666])
const geoPath = d3.geoPath().projection(geoMercator)

d3.select('body').style('position', 'relative')

d3.json('geojson/regions.geojson', (dataGeo) => {
  const minMax = d3.extent(dataGeo.features, (d) => parseInt(d.properties.code))
  const colorScale = d3.scaleLinear().domain(minMax).range(['#FFF', '#000'])

  d3.select('svg').selectAll('path.regions').data(dataGeo.features)
    .enter()
    .append('path')
    .classed('regions', true)
    .attr('d', geoPath)
    .style('fill', (d) => colorScale(parseInt(d.properties.code)))

  d3.json('json/villes.json', (dataCities) => {
    d3.select('svg').selectAll('circle.city').data(dataCities)
      .enter()
      .append('circle')
      .classed('city', true)
      .attr('r', 8)
      .attr('cx', (d) => geoMercator([d.x, d.y])[0])
      .attr('cy', (d) => geoMercator([d.x, d.y])[1])
      .style('stroke', 'white')
  })

  d3.selectAll('path.regions')
    .on('mouseenter', /* @this d3Element */ function(d) {
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
        .style('padding', '10px')
        .style('border', '1px solid black')
        .text(() => d.properties.nom)
    })
    .on('mouseleave', /* @this d3Element */ function(d) {
      d3.select('circle.center').remove()
      d3.select('.tooltip').remove()
    })
})
