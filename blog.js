const express = require('express');
const morgan = require('morgan');
const mon = require('mongoose');
const method = require('method-override');
const all_routes = require('./routes/router')

const dburi = 'mongodb+srv://gagan:1234@cluster0.oljierj.mongodb.net/node?retryWrites=true&w=majority'

const app = express();

mon.connect(dburi,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result => app.listen(4000))
.catch((err)=> console.log(err))

app.use(method('_method'));

app.use(express.static('public'));

app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');


app.use(all_routes);
app.get('/about',(req,res)=>{
    res.render('about');
})

app.use((req,res)=>{
    res.status(404).render('404');
})