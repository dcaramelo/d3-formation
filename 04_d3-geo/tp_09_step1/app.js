'use strict';

d3.json('geojson/world.geojson', (countries) => {
  const projection = d3.geoMercator()
  const geoPath = d3.geoPath().projection(projection)
  d3.select('svg')
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'countries')
})
