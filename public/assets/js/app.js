// Whenever someone clicks a p tag
$(document).on("click", ".save-button", function() {
  var thisId = $(this).attr("_id")
  console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
    url: "/api/articles",
    method: "GET"
  })
  .then(function() {
    $.post(`/api/articles/saved/${thisId}`, function(data) {
      console.log(data)
    })
  })    
});

$(document).on("click", ".delete-button", function() {
  var thisId = $(this).attr("_id")
  console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
    url: `/api/articles/`,
    method: "GET"
  })
  .then(function() {
    $.post(`/api/articles/${thisId}`, function(data) {
      console.log(data)
      window.location.reload()
    })
  })
  
    // With that done, add the note information to the page    
});

$(document).on('click', '.scrape-new', function(){
  $.ajax({
    method: "GET",
    url:'/scrape'
  })
  .then(function(data){
    window.location.reload()
    console.log(data)
  })
})

// $(document).on('click', '.clear', function(req, res){
//   $.ajax({
//     method: "GET",
//     url:'/scrape'
//   })
//   .then(function(data){
//     window.location.reload()
//     console.log(data)
//   })
// })

// // When you click the savenote button
// $(document).on("click", "#savenote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });
