var repoName = window.location.hash.replace("#", "");

var url = "https://api.github.com/repos/" + repoName;

d3.json(url, function(error, data) {
  console.log(data);
});
