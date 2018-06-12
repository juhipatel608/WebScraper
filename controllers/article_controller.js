var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Articles = require("../models/articles.js");
var Notes = require("../models/notes.js");
var router = express.Router();

router.get("/articles/:id", function(req, res) {
    Articles.findOne({ "_id": req.params.id })
    .populate("notes")
    .exec(function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(doc);
        }
    });
});


router.post("/articles/:id", function(req, res) {
    var newNote = new Notes(req.body);
    newNote.save(function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            Articles.findOneAndUpdate({ "_id": req.params.id }, { "notes": doc._id })
            .populate("notes")
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(doc);
                }
            });
        }
    });
});


router.get("/", function(req, res) {
    request("http://www.npr.org/sections/technology", function(error, response, html) {
        var $ = cheerio.load(html);
        var entry = [];
        $(".item.has-image").each(function(i, element) {
        	var result = {};
            result.title = $(this).children(".item-info").find("h2.title").text();
            result.source = $(this).children(".item-info").find("h3.slug").find("a").text();
            result.teaser = $(this).children(".item-info").find("p.teaser").text();
            result.img = $(this).children(".item-image").find("a").find("img").attr("src");
            result.link = $(this).children(".item-info").find("h2.title").find("a").attr("href"); 
            entry.push(new Articles(result));             
        });
        for (var i = 0; i < entry.length; i++) {
            entry[i].save(function(err, data) {
                if (err) {
                    console.log(err);
                } 
                else {
                    console.log(data);
                }
            });
            if (i === (entry.length - 1)) {
                res.redirect("/articles");
            }

    
        }

    });
});

router.get("/articles", function(req, res) {
    Articles.find({"status": 0}, function(err, data) {
        if (err){ 
            console.log(err);
        } else {
            res.render("index", {articles: data, current: true});
        }
    });
});


router.get("/saved", function(req, res) {
    Articles.find({"status": 1}, function(err, data) {
        if (err) { 
            console.log(err);
        } else {
            res.render("index", {articles: data, saved: true});
        }
    });
});



router.post("/save", function(req, res) {
    Articles.findOneAndUpdate({"_id": req.body.articleId}, {$set : {"status": 1}})
    .exec(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send("Post successful");
        }
    });
});


 
router.post("/unsave", function(req, res) {
    Articles.findOneAndUpdate({"_id": req.body.articleId}, {$set : {"status": 0}})
    .exec(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send("Post successful");
        }
    });
});



module.exports = router;