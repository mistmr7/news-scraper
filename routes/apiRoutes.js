const db = require('../models')

module.exports = function(app) {
  // Route for getting all Articles from the db
  app.get("/api/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .populate('Note')
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for getting a specific article by its ID
  app.get('/api/articles/:id', function(req, res){
    db.Article.findOne({ _id: req.params.id })
      .populate('note')
      .then(function(dbArticle) {
        console.log(dbArticle)
        res.json(dbArticle)
      })
      .catch(function(err) {
        return res.json(err)
      })
  })

  //FIXME: Not Saving to the api listed 
  // Route for getting all Articles from the db that have been saved
  app.get("/api/articles/saved", function(req, res) {
  // Grab every document in the Articles collection where saved is true
    db.Article.find({ saved: true })
    .then(function(dbArticle) {
      console.log(dbArticle)
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  });

  app.post('/api/articles/:id', function(req, res){
    console.log(req.body)
    let id = req.params.id
  
    db.Article.findByIdAndUpdate({ _id:id }, {$set: {saved: false}}, {new: true})
    .populate('Note')
    .then(function(dbArticle) {
      console.log(dbArticle)
      res.end()
    })
    .catch(function(err) {
      return res.json(err)
    })
  })

  app.post('/api/articles/notes/:id', function(req, res){
  
    db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id:req.params.id }, { note: dbNote._id }, {new: true})
    })
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
      return res.json(err)
    }) 
  })

  // Post route to post articles to save based on their ID
  app.post('/api/articles/saved/:id', function(req, res){
    console.log(req.body)
    let id = req.params.id
  
    db.Article.findByIdAndUpdate({ _id:id }, {$set: {saved: true}}, {new: true})
    .populate('Note')
    .then(function(dbArticle) {
      console.log(dbArticle)
      res.end()
    })
    .catch(function(err) {
      return res.json(err)
    })
  })

  app.delete('/api/clear', function(req, res) {
    db.Article.deleteMany({ saved: false }, function(err) {
      if (err) throw err
    })
  })
}
