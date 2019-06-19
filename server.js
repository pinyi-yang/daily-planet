const express = require('express');
const app = express();
const layout = require('express-ejs-layouts');
const fs = require('fs');
const PORT = 3000;
const override = require('method-override')

app.set('view engine', 'ejs');
app.use(layout);
app.use(express.static(__dirname + '/static')); //!!!
app.use(express.urlencoded({extended: false}));
app.use(override('_method'));

//* GET / 
//! test 1
app.get('/', function(req, res) {
    res.render('index');
})

//* GET /articles
app.get('/articles', function(req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articlesData = JSON.parse(articles);
    res.render('articles/index', {articles : articlesData});
});

//* GET /articles/new
app.get('/articles/new', function(req, res) {
    res.render('articles/new');
})

//* GET /articles/edit/:id
app.get('/articles/edit/:id', function(req, res) {
    let id = parseInt(req.params.id);
    let articles = fs.readFileSync('./articles.json');
    let articlesData = JSON.parse(articles);
    res.render('articles/edit', {article:articlesData[id], id});
})


//* GET /articles/:id
app.get('/articles/:id', function(req, res) {
    console.log('start');
    let articles = fs.readFileSync('./articles.json');
    let articlesData = JSON.parse(articles);
    console.log(articlesData);
    let id = parseInt(req.params.id);
    res.render('articles/show', {article:articlesData[id], id});
})

//* POST /articles
app.post('/articles', function(req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articlesData = JSON.parse(articles);
    let newArticle = {
        title : req.body.articleTitle,
        body : req.body.articleBody
    }
    console.log('new article' + newArticle);
    articlesData.push(newArticle);
    fs.writeFileSync('./articles.json', JSON.stringify(articlesData));

    res.redirect('/articles');
})


//* DELETE /articles/:id
app.delete('/articles/:id', function(req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articlesData = JSON.parse(articles);
    let id = parseInt(req.params.id);
    articlesData.splice(id, 1);
    fs.writeFileSync('./articles.json', JSON.stringify(articlesData));
    res.redirect('/articles');
})

//* PUT /articles/:id
app.put('/articles/:id', function(req, res) {
    let id = parseInt(req.params.id);
    let newArticle = {
        title: req.body.articleTitle,
        body: req.body.articleBody
    }
    let articles = fs.readFileSync('./articles.json');
    let articlesData = JSON.parse(articles);
    articlesData[id] = newArticle;
    fs.writeFileSync('./articles.json', JSON.stringify(articlesData));
    res.redirect('/articles/' + id);

})




app.listen(PORT || 3000, function() {
    console.log('Connected to port 3000');
})