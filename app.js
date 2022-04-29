const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded({
    extended: true
}));

const uri = "mongodb://localhost:27017";

mongoose.connect(uri + '/wikiDB');

app.set('view engine', 'ejs');

app.listen(3000, function () {
    console.log("Server started");
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {
        console.log(req.body.title);

        console.log(req.body.content);
        const newArticle = new Article({

            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Deletion of all successful");
            } else {
                res.send(err);
            }
        });
    });

app.route("/articles/:articleTitle")

    .get(function (req, res) {
        Article.findOne({
            title: req.params.articleTitle
        }, function (err, foundArticle) {
            if (!err) {
                res.send(foundArticle);
            } else {
                res.send(err);
            }
        });
    })

    .put(function (req, res) {
        Article.replaceOne({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            },
            function (err) {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .patch(function (req, res) {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            function (err) {
                if (!err) {
                    res.send("Successfully patched article.")
                } else {
                    res.send(err);
                }
            }
        )
    })
    
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted the corresponding article.")
                } else {
                    res.send(err);
                }
            }
        )
    });