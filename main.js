//Setting the dimensions and margin

var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// Create a SVG Canvas

var gitHubRepo = "https://api.github.com/users/Bijay-Panthi";

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Getting Data from the Api
d3.json(gitHubRepo, function(error, data) {
  if (error) throw error;
  console.log(data);
  console.log(data.repos_url);

  // format the data
});
