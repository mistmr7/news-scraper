var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require('express-handlebars')

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mongoHeadlines';

// Configure middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(uristring, { useNewUrlParser: true }, function(err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// Routes
require('./routes/apiRoutes.js')(app)


//FIXME: error on scraping
// A GET route for scraping the NYTimes website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article.css-180b3ld").each(function() {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).find('a').find('h2').text()
      result.description = $(this).find('p').text()
      result.link = 'https://www.nytimes.com/' + $(this).find("a").attr("href")
      
      console.log(result.link)

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.writeContinue(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

app.get('/saved', function(req, res) {
  db.Article.find({ saved: true })
  .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
    console.log(dbArticle)
    var hbsObject = {
      articles: dbArticle
    }
    res.render('saved', hbsObject);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
})

app.get('/', function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      console.log(dbArticle)
      var hbsObject = {
        articles: dbArticle
      }
      res.render('index', hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
})

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});