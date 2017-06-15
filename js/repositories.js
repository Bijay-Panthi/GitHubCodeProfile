var repoName = window.location.hash.replace("#", "");

var url = "https://api.github.com/repos/" + repoName;

d3.json(url, function(error, data) {
  console.log(data);
  $("#reponame").text("Repo name: " + data.name);
  $("#created").text("Date  Created: " + data.created_at);
  $("#lastupdated").text("Last Updated: " + data.updated_at);
  $("#size").text("Size : " + data.size);
});

// <h2 id="reponame">Loading...</h2>
// <h4 id="lastupdated">Loading...</h4>
// <p id="followers">Loading...</p>
// <p id="following">Loading...</p>
// <p id="public_repos">Loading...</p>
// <p id="public_gists">Loading...</p>
