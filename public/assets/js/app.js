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
    $.post(`/api/articles/saved/${thisId}`, function(err) {
      if (err) {
        throw new Error('Failed on posting to the api/articles/saved/:id')
      }
    })
  })    
});

$(document).on("click", ".delete-button", function() {
  var thisId = $(this).attr("_id")
  console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
    url: `/api/articles`,
    method: "GET"
  })
  .then(function() {
    $.post(`/api/articles/${thisId}`, function(data) {
      console.log(data)
      window.location.reload()
    })
  })   
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

$(document).on('click', '.clear', function(req, res){
  $.ajax({
    method: 'DELETE',
    url: '/api/clear'
  }).then(function(err) {
    if (err) {
      throw new Error('Error occurred deleting from the api/articles')
    } else {
      window.location.reload()
    }
  })
})

