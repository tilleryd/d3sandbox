// Bar.react.js

import React from 'react';

import ColumnBarChart from 'bar/ColumnBarChart.react';
import HtmlBarChart from 'bar/HtmlBarChart.react';
import OrdinalBarChart from 'bar/OrdinalBarChart.react';
import SvgBarChart from 'bar/SvgBarChart.react';

var Bar = React.createClass({
  render() {
    return (
      <div className="main">
        <h1>Bar Charts</h1>
        <HtmlBarChart />
        <div className="spacer" />
        <SvgBarChart />
        <div className="spacer" />
        <ColumnBarChart />
        <div className="spacer" />
        <OrdinalBarChart />
      </div>
    );
  }
});

module.exports = Bar;
