// Visualizations.react.js

import React from 'react';

import ForceDirectedGraph1 from 'visualizations/ForceDirectedGraph1.react';
import ForceDirectedGraph2 from 'visualizations/ForceDirectedGraph2.react';

var Visualizations = React.createClass({
  render() {
    return (
      <div className="main-content">
        <h1>Force-Directed</h1>
        <ForceDirectedGraph1 />
        <div class="spacer" />
        <ForceDirectedGraph2 />
      </div>
    );
  }
});

module.exports = Visualizations;
