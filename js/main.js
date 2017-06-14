//Setting the dimensions and margin

var createChart = function(userData) {
  // Determining the dimensions of the Canvas where the figure is drawn
  var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 600 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // Create a SVG Canvas
  // var svg = d3
  //   .select("body")
  //   .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .style("background-color", "red")
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var diameter = 960,
    format = d3.format(",d"),
    color = d3.scaleOrdinal(d3.schemeCategory20c);

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");
  // debugger;
  console.log(userData);

  //Working with data
  // d3.json(userData, function(data) {
  //   console.log(data);

  // if (error) throw error;
  //   data.forEach(function(d) {
  //     console.log(d);
  // d.date = parseTime(d.date);
  // d.close = +d.close;
  //});
  //}); // End d3
}; // end createChart

// console.log("loaded");
//

//
//

//

//
// // Getting Data from the Api

//

$(function() {
  $("#submitButton").on("click", function(e) {
    e.preventDefault();
    $("#gitHubData").html(
      '<div id="loader"><img src="https://i.imgur.com/UqLN6nl.gif" alt="loading..."></div>'
    );

    var username = $("#githubUsername").val();
    var requestUrl = "https://api.github.com/users/" + username;
    var repoUrl = "https://api.github.com/users/" + username + "/repos";

    requestJSON(requestUrl, function(json) {
      if (json.message === "Not Found" || username === "") {
        $("#gitHubData").html("<h2>No User Info Found</h2>");
      } else {
        // else we have a user and we display their info
        var fullname = json.name;
        var username = json.login;
        var aviurl = json.avatar_url;
        var profileurl = json.html_url;
        var location = json.location;
        var followersnum = json.followers;
        var followingnum = json.following;
        var reposnum = json.public_repos;

        if (fullname === undefined) {
          fullname = username;
        }

        var outhtml =
          "<h2>" +
          fullname +
          ' <span class="smallname">(@<a href="' +
          profileurl +
          '" target="_blank">' +
          username +
          "</a>)</span></h2>";
        outhtml =
          outhtml +
          '<div class="ghcontent"><div class="avi"><a href="' +
          profileurl +
          '" target="_blank"><img src="' +
          aviurl +
          '" width="80" height="80" alt="' +
          username +
          '"></a></div>';
        outhtml =
          outhtml +
          "<p>Followers: " +
          followersnum +
          " - Following: " +
          followingnum +
          "<br>Repos: " +
          reposnum +
          "</p></div>";
        outhtml = outhtml + '<div class="repolist clearfix">';

        var repositories;
        $.getJSON(repoUrl, function(json) {
          repositories = json;
          outputPageContent();
        });

        function outputPageContent() {
          if (repositories.length === 0) {
            outhtml = outhtml + "<p>No repos!</p></div>";
          } else {
            outhtml = outhtml + "<p><strong>Repos List:</strong></p> <ul>";
            $.each(repositories, function(index) {
              outhtml =
                outhtml +
                '<li><a href="' +
                repositories[index].html_url +
                '" target="_blank">' +
                repositories[index].name +
                "</a></li>";
            });
            outhtml = outhtml + "</ul></div>";
          }
          $("#gitHubData").html(outhtml);
        } // end outputPageContent()
      } // end else statement
    }); // end requestJSON Ajax call
  }); // end click event handler

  function requestJSON(url, callback) {
    d3.json(url, createChart);
    // $.ajax({
    //   url: url,
    //   dataType: "json",
    //   async: true,
    //   complete: function(data) {
    //     // console.log(data);
    //     // // console.log(callback);
    //     callback.call(null, data.responseJSON);
    //     //
    //     // var postData = data;
    //     // // console.log(postData);
    //     createChart(data.responseJSON);
    //
    //     // console.log(data);
    //   }
    // });
  }
});
