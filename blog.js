const express = require('express');
const morgan = require('morgan');
const mon = require('mongoose');
const Blog = require('./schema');
const method = require('method-override');

const dburi = 'mongodb+srv://gagan:1234@cluster0.oljierj.mongodb.net/node?retryWrites=true&w=majority'

const app = express();

mon.connect(dburi,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result => app.listen(3000))
.catch((err)=> console.log(err))

app.use(method('_method'));

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

app.get('/blogs/:id',(req,res)=>{
    console.log("HERjdE")

    const id = req.params.id;
    Blog.findById(id)
    .then(result => {
        res.render('details',{details:result});
    })
    .catch(err => console.log(err))
})


app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    console.log("HERjdE")

    Blog.findByIdAndDelete(id)
        .then((result) => {
            console.log("HERjdE")

            res.json({redirect:'/'})

        })
        .catch(err => {
            console.error('Error occurred:', err);
            res.status(500).send('Error deleting the document');
        });
});

app.get('/edit/:id',(req,res)=>{
    const id = req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('edit',{data:result})    
    })
    .catch(err => console.log(err))    
})

app.put('/edit/:id',(req,res)=>{
    const id = req.params.id;
    const body = req.body;

    Blog.findByIdAndUpdate(id,body,{ new: true})
    .then(updateBlog => {
        if (!updateBlog){
            return res.status(404).send('Blog Post not found')
        }
        res.redirect(`/blogs/${updateBlog.id}`)
    })
    .catch(err =>{
        console.error('Error occurred: ', err);
        res.status(500).send('Error updating the document')
    })
})

console.log('ch')


app.use((req,res)=>{
    res.status(404).render('404');
})