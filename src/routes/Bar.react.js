// Bar.react.js

import React from 'react';

import HtmlBarChart from 'bar/HtmlBarChart.react';
import SvgBarChart from 'bar/svgBarChart.react';

var Bar = React.createClass({
  render() {
    return (
      <div className="main">
        <h1>Bar Charts</h1>
        <HtmlBarChart />
        <div className="spacer" />
        <SvgBarChart />
      </div>
    );
  }
});

module.exports = Bar;
