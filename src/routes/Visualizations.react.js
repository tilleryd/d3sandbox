// Visualizations.react.js

import React from 'react';

import InterestGraphView from 'visualizations/InterestGraphView.react';

var Visualizations = React.createClass({
  render() {
    return (
      <div className="main">
        <h1>Visualizations</h1>
        <InterestGraphView />
      </div>
    );
  }
});

module.exports = Visualizations;
