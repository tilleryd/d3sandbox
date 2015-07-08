// Chart.react.js

import React from 'react';

class Chart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
  	return (
  		<div className="chart">
  		  <h2>{this.props.title}</h2>
  		  {this.props.children}
  		</div>
    );
  }

}

Chart.propTypes = {
	title: React.PropTypes.string
};

Chart.defaultProps = {
	title: ''
};

module.exports = Chart;
