// app.react.js

global.$ = global.jQuery = require('jquery');

import React from 'react';
import Router from 'react-router';

// Routes
import Bar from 'routes/Bar.react';
import Home from 'routes/Home.react';
import Visualizations from 'routes/Visualizations.react';

let { DefaultRoute, Link, Route, RouteHandler } = Router;

let App = React.createClass({
  render() {
  	return(
			<div className="page-wrapper">
		    <nav>
          <ul>
            <li><Link to="app">Home</Link></li>
            <li><Link to="bar">Bar Charts</Link></li>
            <li><Link to="visualizations">Visualizations</Link></li>
          </ul>
		    </nav>
		    <RouteHandler {...this.props} />
		  </div>
	  )
	}
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="bar" handler={Bar}/>
    <Route name="visualizations" handler={Visualizations}/>
    <DefaultRoute handler={Home}/>
  </Route>
);


Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.getElementById('app'));
});
