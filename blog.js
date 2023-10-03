const express = require('express');
const morgan = require('morgan');
const mon = require('mongoose');
const Blog = require('./schema');

const dburi = 'mongodb+srv://gagan:1234@cluster0.oljierj.mongodb.net/node?retryWrites=true&w=majority'

const app = express();

mon.connect(dburi,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result => app.listen(3000))
.catch((err)=> console.log(err))


app.use(express.static('public'));

app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');



app.get('/', (req, res) => {
    Blog.find()
        .then((blogs) => {
            res.render('index', { blogs });
        })
        .catch((error) => {
            res.status(500).send('An error occurred: ' + error.message);
        });
});


app.get('/about',(req,res)=>{
    res.render('about');
})

app.get('/create',(req,res)=>{
    res.render('create');
})

app.post('/create',(req,res)=>{
    const blog = new Blog(req.body);
    blog.save()
    
    .then(result => {console.log(result)
          res.redirect('/')})
    .catch(err => {console.log(err)})
})

app.use((req,res)=>{
    res.status(404).render('index');
})