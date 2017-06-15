var repoName = window.location.hash.replace("#", "");
var url = "https://api.github.com/repos/" + repoName;

var languageUrl = "https://api.github.com/repos/" + repoName + "/languages";
var commitUrl = "https://api.github.com/repos/" + repoName + "/commits";

$.getJSON(commitUrl).done(function(data) {
  // console.log(data);
  data.forEach(function(event) {
    // console.log(event.commit.message, event.committer.login, event.commit.url);
    // Create a new list item
    var message = event.committer.login + ": " + event.commit.message;
    var $li = $("<li></li>");
    var $a = $("<a></a>");
    $a.attr("href", event.html_url);
    $a.attr("target", "_blank");
    $a.text(message);
    $li.append($a);
    $li.appendTo(".recentCommits ul");
    console.log(message);

    // var commitMessage = event.commit.message;
    // console.log(commitMessage);

    // $("#commits").text("Commit Messages: " + commitMessage);

    // Create a new link, set the text to be the commit URL
    // Set the text of the link to be something along the lines of: "ga-wolf: Added slides for regex"
    // Append the link to the list item
    // Append the list item to the ul in .recentCommits
  });
});

$.getJSON(url).done(function(data) {
  console.log(data);
  $("#reponame").text("Repo name: " + data.name);
  $("#created").text("Date  Created: " + data.created_at);
  $("#lastupdated").text("Last Updated: " + data.updated_at);
  $("#size").text("Size : " + data.size);
});

var margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = $(".bubbleChart").width() - margin.left - margin.right,
  height = $(".bubbleChart").height() - margin.top - margin.bottom;

var diameter = Math.min(width, height);

var format = d3.format(",d"),
  color = d3.scaleOrdinal(d3.schemeCategory20c);
var bubble = d3.pack().size([diameter, diameter]).padding(0.5);

var svg = d3
  .select(".bubbleChart")
  .append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

var tooltip = d3
  .select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("color", "white")
  .style("padding", "8px")
  .style("background-color", "rgba(0, 0, 0, 0.75)")
  .style("border-radius", "6px")
  .style("font", "12px sans-serif")
  .text("tooltip");

d3.json(languageUrl, function(error, data) {
  var dataArr = [];
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i += 1) {
    var currentKey = keys[i];
    var currentValue = data[currentKey];
    dataArr.push({ size: currentValue, name: currentKey });
  }

  var root = d3
    .hierarchy({ children: dataArr })
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      console.log(a);
      return b.size - a.size;
    });
  bubble(root);

  var node = svg
    .selectAll(".node")
    .data(root.children)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  node.append("title").text(function(d) {
    console.log(d);
    return d.data.name + ": " + format(d.value);
  });

  node
    .append("circle")
    .attr("r", function(d) {
      return d.r;
    })
    .style("fill", function(d) {
      return color(d.data.name);
    })
    .on("mouseover", function(d) {
      tooltip.text(d.data.name + ": " + format(d.value));
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      return tooltip
        .style("top", d3.event.pageY - 10 + "px")
        .style("left", d3.event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      return tooltip.style("visibility", "hidden");
    });

  node
    .append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .text(function(d) {
      return d.data.name.substring(0, d.r / 3);
    });
});

function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children)
      node.children.forEach(function(child) {
        recurse(node.name, child);
      });
    else
      classes.push({
        packageName: name,
        className: node.name,
        value: node.size
      });
  }

  recurse(null, root);
  return { children: classes };
}

// <h2 id="reponame">Loading...</h2>
// <h4 id="lastupdated">Loading...</h4>
// <p id="followers">Loading...</p>
// <p id="following">Loading...</p>
// <p id="public_repos">Loading...</p>
// <p id="public_gists">Loading...</p>
