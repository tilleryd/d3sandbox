// ForceDirectedGraph2.react.js

import d3 from 'd3';

import Chart from '../components/Chart.react';
import React from 'react';

class ForceDirectedGraph2 extends React.Component {

  constructor(props) {
    super(props);
    
    this.allData = [];
    this.curLinksData = [];
  }

  componentDidMount() {
    let width = 960,
        height = 500;

    let force = d3.layout.force()
        .charge(-350)
        .linkDistance(50)
        .size([width, height]);

    let svg = d3.select("#forceDirected2").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("data/herosandvillains.json", (error, data) => {
      if (error) throw error;

      this.allData = this._setupData(data);

      this.curLinksData = this._filterLinks(this.allData.links, this.allData.nodes);

      force
          .nodes(data.nodes)
          .links(data.links)
          .start();

      let link = svg.selectAll(".link")
          .data(this.curLinksData, function(d) { return `${d.source.id}_${d.target.id}`; })
        .enter().append("line")
          .attr("class", "link")
          .style("stroke-width", 1);

      let node = svg.selectAll(".node")
          .data(data.nodes, function(d) { return d.id; })
        .enter().append("circle")
          .attr("class", "node")
          .attr("r", function(d) { return d.connections * 3; })
          .style("fill", d => this._getGroupColor(d.group))
          .call(force.drag);

      node.append("title")
          .text(function(d) { return d.name; });

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      });
    });
  }

  _setupData(data) {
    let nodesMap = this._mapNodes(data.nodes);

    data.links.forEach(function(l) {
      l.source = nodesMap.get(l.source);
      l.target = nodesMap.get(l.target);
    });

    return data;
  }

  _getGroupColor(group) {
    switch (group) {
      case "hero":
        return "#3182bd";
      case "villain":
        return "#e6550d";
      case "sw-hero":
        return "#6baed6";
      case "sw-villain":
        return "#fd8d3c";
      case "lotr-hero":
        return "#74c476";
      case "lotr-villain":
        return "#9e9ac8";
      default:
        return "#969696";
    }
  }

  _filterLinks(allLinks, curNodes) {
    curNodes = this._mapNodes(curNodes);
    allLinks.filter(function(l) {
      return curNodes.get(l.source.id) && curNodes.get(l.target.id);
    });
    return allLinks;
  }

  _mapNodes(nodes) {
    let nodesMap = d3.map();
    
    nodes.forEach(function(n) {
      nodesMap.set(n.id, n);
    });

    return nodesMap;
  }

  render() {
  	return (
  		<Chart title="Graph 2">
  		  <div id="forceDirected2" className="force-directed-graph"></div>
      </Chart>
    );
  }

}

ForceDirectedGraph2.propTypes = {
};

ForceDirectedGraph2.defaultProps = {
};

module.exports = ForceDirectedGraph2;
