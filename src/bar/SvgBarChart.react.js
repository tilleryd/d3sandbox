// SvgBarChart.react.js

import d3 from 'd3';

import Chart from '../components/Chart.react';
import React from 'react';

class SvgBarChart extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
		let width = 420,
		    barHeight = 20;
		    
		let x = d3.scale.linear()
		    .range([0, 420]);

		let chart = d3.select(".svg-bar-chart")
		    .attr("width", width);

		d3.csv("data/barchart.csv", type, function(error, data) {
      x.domain([0, d3.max(data, function(d) { return d.value; })]);
      
      chart.attr("height", barHeight * data.length);

			let bar = chart.selectAll("g")
			    .data(data)
			  .enter().append("g")
			    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

			bar.append("rect")
			    .attr("width", function(d) { return x(d.value); })
			    .attr("height", barHeight - 1);

			bar.append("text")
			    .attr("x", function(d) { return x(d.value) - 3; })
			    .attr("y", barHeight / 2)
			    .attr("dy", ".35em")
			    .text(function(d) { return d.value; });
		});

    // d3.csv and d3.tsv return data as strings so we need to convert the values to numbers first
		function type(d) {
		  d.value = +d.value;
		  return d;
		}
  }

  render() {
  	return (
  		<Chart title="SVG">
  		  <svg className="svg-bar-chart"></svg>
      </Chart>
    );
  }

}

SvgBarChart.propTypes = {
};

SvgBarChart.defaultProps = {
};

module.exports = SvgBarChart;
