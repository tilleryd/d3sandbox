// app.js

import React from 'react';

import HtmlBarChart from 'bar/HtmlBarChart.react';
import SvgBarChart from 'bar/svgBarChart.react';

React.render(
  <div className="page-wrapper">
    <header>
      <h1>d3 Charts</h1>
    </header>     
    <HtmlBarChart />
    <div className="spacer" />
    <SvgBarChart />
  </div>,
  document.getElementById('app')
);