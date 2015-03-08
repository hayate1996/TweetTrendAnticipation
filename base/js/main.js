var fileName, fileNumber;
var diameter, babble, format, color;
window.onload = function(){
  diameter = 800,
  format = d3.format(",d"),
  color = d3.scale.category20c();

  bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, diameter])
      .padding(1.5);

  fileName = [
    "../data/flare_0.json",
    "../data/flare_1.json",
    "../data/flare_2.json",
    "../data/flare_3.json",
    "../data/flare_4.json",
  ];

  fileNumber = 0;

  drawGraph();
};

function changeGraph(number) {
  switch (number) {
    case "1":
      fileNumber = 0;
      break;
    case "2":
      fileNumber = 1;
      break;
    case "3":
      fileNumber = 2;
      break;
    case "4":
      break;
    case "5":
      fileNumber = 3;
      break;
    default:
      return;
  }
  redrawGraph();
}

function drawGraph() {

  var svg = d3.select("#innerContent").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  d3.json(fileName[fileNumber], function(error, root) {
    var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(root))
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.packageName); });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });
  });

  d3.select(self.frameElement).style("height", diameter + "px");
}

function redrawGraph() {
  var svg = d3.select("#innerContent").select("svg")

  d3.json(fileName[fileNumber], function(error, root) {
    var node = svg.selectAll(".node").data(bubble.nodes(classes(root))
    .filter(function(d) { return !d.children; }))

    node.transition()
        .attr("r", function(d) { return d.r; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

    node.select("circle").transition()
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.packageName); });

    // node.exit().remove();
  });
}

function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}
