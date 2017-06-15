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

//Setting the dimensions and margin

var createChart = function(error, data) {
  $(".bubbleChart").html("");
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
    .attr("class", "bubble")
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)");

  var root = d3
    .hierarchy({ children: data })
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
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
    return d.data.name + ": " + format(d.value);
  });
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
  node
    .append("circle")
    .attr("r", function(d) {
      return d.r;
    })
    .style("fill", function(d) {
      return color(d.data.name);
    })
    .on("click", function(d) {
      window.location.replace("/repositories.html#" + d.data.full_name);
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
};

$(function() {
  $("form").on("submit", function(e) {
    e.preventDefault();
    // $("#gitHubData").html(
    //   '<div id="loader"><img src="https://i.imgur.com/UqLN6nl.gif" alt="loading..."></div>'
    // );

    var username = $("#githubUsername").val();
    var requestUrl = "https://api.github.com/users/" + username;
    var repoUrl = "https://api.github.com/users/" + username + "/repos";

    requestJSON(repoUrl, function(json) {
      createChart(json);
    });

    $.getJSON(requestUrl).done(function(data) {
      $("#profile").attr("src", data.avatar_url);
      $("#username").text("Username: " + data.login);
      $("#company").text("Company: " + (data.company || "Unknown"));
      $("#location").text("Location: " + (data.location || "Unknown"));
      $("#email").text("Email: " + (data.email || "Unknown"));
      $("#followers").text("Follower Count: " + data.followers);
      $("#following").text("Following Count: " + data.following);
      $("#public_repos").text("Public Repos: " + data.public_repos);
      $("#public_gists").text("Public Gists: " + data.public_gists);
    });
  }); // end click event handler

  function requestJSON(url, callback) {
    d3.json(url, createChart);
  }
});
