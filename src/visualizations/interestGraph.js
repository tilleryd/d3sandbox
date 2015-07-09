import d3 from 'd3';
import Tooltip from '../util/Tooltip';

let InterestGraph = function() {
  // variables we want to access
  // in multiple places of interestGraph
  let width = 960;
  let height = 800;

  // allData will store the unfiltered data
  let allData = [];
  let curLinksData = [];
  let curNodesData = [];
  let linkedByIndex = {};

  // these will hold the svg groups for
  // accessing the nodes and links display
  let nodesG = null;
  let linksG = null;

  // these will point to the circles and lines
  // of the nodes and links
  let node = null;
  let link = null;

  // variables to refect the current settings
  // of the visualization
  let layout = "force";
  let filter = "all";
  let sort = "songs";

  // groupCenters will store our radial layout for
  // the group by artist layout.
  let groupCenters = null;

  // our force directed layout
  let force = d3.layout.force();

  // color function used to color nodes
  let nodeColors = d3.scale.category20();

  // tooltip used to display details
  let tooltip = Tooltip("vis-tooltip", 230);

  // charge used in artist layout
  let charge = function(node) {
    return -Math.pow(node.radius, 2.0) / 2;
  }

  // Starting point for interestGraph visualization
  // Initializes visualization and starts force layout
  let interestGraph = function(selection, data) {
    // format our data
    allData = setupData(data);

    // create our svg and groups
    let vis = d3.select(selection).append("svg")
      .attr("width", width)
      .attr("height", height);
    linksG = vis.append("g").attr("id", "links");
    nodesG = vis.append("g").attr("id", "nodes");

    // setup the size of the force environment
    force.size([width, height]);

    setLayout("force");
    setFilter("all");

    // perform rendering and start force layout
    update();
  }

  // The update() function performs the bulk of the
  // work to setup our visualization based on the
  // current layout/sort/filter.
  //
  // update() is called everytime a parameter changes
  // and the interestGraph needs to be reset.
  let update = function() {
    // filter data to show based on current filter settings.
    curNodesData = filterNodes(allData.nodes);
    curLinksData = filterLinks(allData.links, curNodesData);

    // sort nodes based on current sort and update centers for
    // radial layout
    if (layout == "radial") {
      let artists = sortedArtists(curNodesData, curLinksData);
      updateCenters(artists);
    }

    // reset nodes in force layout
    force.nodes(curNodesData);

    // enter / exit for nodes
    updateNodes();

    // always show links in force layout
    if (layout == "force") {
      force.links(curLinksData);
      updateLinks();
    } else {
      // reset links so they do not interfere with
      // other layouts. updateLinks() will be called when
      // force is done animating.
      force.links([]);
      // if present, remove them from svg 
      if (link) {
        link.data([]).exit().remove();
        link = null;
      }
    }

    // start me up!
    force.start()
  }

  // Public function to switch between layouts
  interestGraph.toggleLayout = function(newLayout) {
    force.stop();
    setLayout(newLayout);
    update();
  }

  // Public function to switch between filter options
  interestGraph.toggleFilter = function(newFilter) {
    force.stop();
    setFilter(newFilter);
    update();
  }

  // Public function to switch between sort options
  interestGraph.toggleSort = function(newSort) {
    force.stop();
    setSort(newSort);
    update();
  }

  // Public function to update highlighted nodes
  // from search
  interestGraph.updateSearch = function(searchTerm) {
    let searchRegEx = new RegExp(searchTerm.toLowerCase());
    let element, match;

    node.each(function(d) {
      element = d3.select(this);
      match = d.name.toLowerCase().search(searchRegEx);
      if (searchTerm.length > 0 && match >= 0) {
        element
          .style("fill", "#F38630")
          .style("stroke-width", 2.0)
          .style("stroke", "#555");
        d.searched = true;
      } else {
        d.searched = false;
        element
          .style("fill", function(d) { return nodeColors(d.artist) })
          .style("stroke-width", 1.0)
      }
    });
  }

  interestGraph.updateData = function(newData) {
    allData = setupData(newData);
    link.remove();
    node.remove();
    update();
  }

  // called once to clean up raw data and switch links to
  // point to node instances
  // Returns modified data
  let setupData = function(data) {
    // initialize circle radius scale
    let countExtent = d3.extent(data.nodes, function(d) { return d.playcount; });
    let circleRadius = d3.scale.sqrt().range([3, 12]).domain(countExtent);

    data.nodes.forEach(function(n) {
      // set initial x/y to values within the width/height
      // of the visualization
      n.x = Math.floor(Math.random()*width);
      n.y = Math.floor(Math.random()*height);
      // add radius to the node so we can use it later
      n.radius = circleRadius(n.playcount);
    });

    // id's -> node objects
    let nodesMap = mapNodes(data.nodes);

    // switch links to point to node objects instead of id's
    data.links.forEach(function(l) {
      l.source = nodesMap.get(l.source);
      l.target = nodesMap.get(l.target);

      // linkedByIndex is used for link sorting
      linkedByIndex[`${l.source.id},${l.target.id}`] = 1;
    });

    return data;
  }

  // Helper function to map node id's to node objects.
  // Returns d3.map of ids -> nodes
  let mapNodes = function(nodes) {
    let nodesMap = d3.map();
    
    nodes.forEach(function(n) {
      nodesMap.set(n.id, n);
    });

    return nodesMap;
  }

  // Helper function that returns an associative array
  // with counts of unique attr in nodes
  // attr is value stored in node, like 'artist'
  let nodeCounts = function(nodes, attr) {
    let counts = {};
    
    nodes.forEach(function(d) {
      if (counts[d[attr]] == null) {
        counts[d[attr]] = 0;
      }
      counts[d[attr]] += 1;
    });

    return counts;
  }

  // Given two nodes a and b, returns true if
  // there is a link between them.
  // Uses linkedByIndex initialized in setupData
  let neighboring = function(a, b) {
    return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id];
  }

  // Removes nodes from input array
  // based on current filter setting.
  // Returns array of nodes
  let filterNodes = function(allNodes) {
    let filteredNodes = allNodes;
    
    if (filter == "popular" || filter == "obscure") {
      let playcounts = allNodes.map(function(d) { 
        return d.playcount; 
      }).sort(d3.ascending);

      let cutoff = d3.quantile(playcounts, 0.5);
      filteredNodes = allNodes.filter(function(n) {
        if (filter == "popular") {
          return n.playcount > cutoff;
        } else if (filter == "obscure") {
          return n.playcount <= cutoff;
        }
      });
    }

    return filteredNodes;
  }

  // Returns array of artists sorted based on
  // current sorting method.
  let sortedArtists = function(nodes, links) {
    let artists = [];
    if (sort == "links") {
      let counts = {};
      links.forEach(function(l) {
        if (counts[l.source.artist] == null) {
          counts[l.source.artist] = 0;
        }
        counts[l.source.artist] += 1;

        if (counts[l.target.artist] == null) {
          counts[l.target.artist] = 0;
        }
        counts[l.target.artist] += 1;
      });

      // add any missing artists that dont have any links
      nodes.forEach(function(n) {
        if (counts[n.artist] == null) {
          counts[n.artist] = 0;
        }
      });

      // sort based on counts
      artists = d3.entries(counts).sort(function(a, b) {
        return b.value - a.value;
      });

      // get just names
      artists = artists.map(function(v) { return v.key; });
    } else {
      // sort artists by song count
      counts = nodeCounts(nodes, "artist");
      artists = d3.entries(counts).sort(function(a, b) {
        b.value - a.value;
      });
      artists = artists.map(function(v) { return v.key; });
    }

    return artists;
  }

  let updateCenters = function(artists) {
    if (layout == "radial") {
      //groupCenters = RadialPlacement().center({"x":width/2, "y":height / 2 - 100})
      //  .radius(300).increment(18).keys(artists);
    }
  }

  // Removes links from allLinks whose
  // source or target is not present in curNodes
  // Returns array of links
  let filterLinks = function(allLinks, curNodes) {
    curNodes = mapNodes(curNodes);
    allLinks.filter(function(l) {
      return curNodes.get(l.source.id) && curNodes.get(l.target.id);
    });
    return allLinks;
  }

  // enter/exit display for nodes
  let updateNodes = function() {
    node = nodesG.selectAll("circle.node")
      .data(curNodesData, function(d) { return d.id; });

    node.enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.radius * 1.5; })
      .style("fill", function(d) { return nodeColors(d.artist); })
      .style("stroke", function(d) { return strokeFor(d); })
      .style("stroke-width", 1.0);

    node.on("mouseover", showDetails)
      .on("mouseout", hideDetails);

    node.exit().remove();
  }

  // enter/exit display for links
  let updateLinks = function() {
    link = linksG.selectAll("line.link")
      .data(curLinksData, function(d) { return `${d.source.id}_${d.target.id}`; });
    link.enter().append("line")
      .attr("class", "link")
      .attr("stroke", "#ddd")
      .attr("stroke-opacity", 0.8)
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    link.exit().remove();
  }

  // switches force to new layout parameters
  let setLayout = function(newLayout) {
    layout = newLayout
    if (layout == "force") {
      force.on("tick", forceTick)
        .charge(-350)
        .linkDistance(50);
    } else if (layout == "radial") {
      force.on("tick", radialTick)
        .charge(charge);
    }
  }

  // switches filter option to new filter
  let setFilter = function(newFilter) {
    filter = newFilter;
  }

  // switches sort option to new sort
  let setSort = function(newSort) {
    sort = newSort;
  }

  // tick function for force directed layout
  let forceTick = function(e) {
    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
  }

  // tick function for radial layout
  let radialTick = function(e) {
    node.each(moveToRadialLayout(e.alpha));

    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

    if (e.alpha < 0.03) {
      force.stop();
      updateLinks();
    }
  }

  // Adjusts x/y for each node to
  // push them towards appropriate location.
  // Uses alpha to dampen effect over time.
  let moveToRadialLayout = function(alpha) {
    k = alpha * 0.1;
    return (function(d) {
      let centerNode = groupCenters(d.artist);
      d.x += (centerNode.x - d.x) * k;
      d.y += (centerNode.y - d.y) * k;
    })();
  }

  // Helper function that returns stroke color for
  // particular node.
  let strokeFor = function(d) {
    d3.rgb(nodeColors(d.artist)).darker().toString();
  }

  // Mouseover tooltip function
  let showDetails = function(d, i) {
    let content = '<p class="main">' + d.name + '</span></p>';
    content += '<hr class="tooltip-hr">';
    content += '<p class="main">' + d.artist + '</span></p>';
    tooltip.showTooltip(content, d3.event);

    // higlight connected links
    if (link) {
      link
        .attr("stroke", function(l) {
          if (l.source == d || l.target == d) {
            return "#555";
          } else {
            return "#ddd";
          }
        })
        .attr("stroke-opacity", function(l) {
          if (l.source == d || l.target == d) {
            return 1.0;
          } else {
            return 0.5;
          }
        });

      // link.each (l) ->
      //   if l.source == d or l.target == d
      //     d3.select(this).attr("stroke", "#555")
    }

    // highlight neighboring nodes
    // watch out - don't mess with node if search is currently matching
    node
      .style("stroke", function(n) {
        if (n.searched || neighboring(d, n)) {
          return "#555";
        } else {
          return strokeFor(n);
        }
      })
      .style("stroke-width", function(n) {
        if (n.searched || neighboring(d, n)) {
          return 2.0;
        } else {
          return 1.0;
        }
      });
  
    // highlight the node being moused over
    d3.select(this).style("stroke", "black")
      .style("stroke-width", 2.0);
  }

  // Mouseout function
  let hideDetails = function(d,i) {
    tooltip.hideTooltip();
    // watch out - don't mess with node if search is currently matching
    node
      .style("stroke", function(n) {
        if (!n.searched) {
          return strokeFor(n);
        } else {
          return "#555";
        }
      })
      .style("stroke-width", function(n) {
        if (!n.searched) {
          return 1.0;
        } else {
          return 2.0;
        }
      });
    if (link) {
      link.attr("stroke", "#ddd")
        .attr("stroke-opacity", 0.8);
    }
  }

  // Final act of InterestGraph() function is to return the inner 'interestGraph()' function.
  return interestGraph
}

module.exports = InterestGraph;
