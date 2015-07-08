// ColumnBarChart.react.js

import d3 from 'd3';

import Chart from '../components/Chart.react';
import React from 'react';

class ColumnBarChart extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  	let width = 960,
		    height = 500;

		let y = d3.scale.linear()
		    .range([height, 0]);

		let chart = d3.select(".column-bar-chart")
		    .attr("width", width)
		    .attr("height", height);

		d3.csv("barchartdata.csv", type, function(error, data) {
      y.domain([0, d3.max(data, function(d) { return d.value; })]);
      
      let barWidth = width / data.length;

			let bar = chart.selectAll("g")
			    .data(data)
			  .enter().append("g")
			    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });

			bar.append("rect")
			    .attr("y", function(d) { return y(d.value); })
			    .attr("height", function(d) { return height - y(d.value); })
			    .attr("width", barWidth - 1);

			bar.append("text")
			    .attr("x", barWidth / 2)
			    .attr("y", function(d) { return y(d.value) + 3; })
			    .attr("dy", ".75em")
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
  		<Chart title="ColumnBarChart">
  		  <svg className="column-bar-chart"></svg>
      </Chart>
    );
  }

}

ColumnBarChart.propTypes = {
};

ColumnBarChart.defaultProps = {
};

module.exports = ColumnBarChart;
