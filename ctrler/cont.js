const Blog = require('../schema');
const crypto = require('crypto');
const AWS = require('aws-sdk');

AWS.config.update({region:'eu-west-1'});


const blog_index = (req,res) => {
        Blog.find()
            .then((blogs) => {
                res.render('index', { blogs });
            })
            .catch((error) => {
                res.status(500).send('An error occurred: ' + error.message);
            });
    }

const blog_details = (req,res)=>{
    console.log("HERjdE")

    const id = req.params.id;
    Blog.findById(id)
    .then(result => {
        res.render('details',{details:result});
    })
    .catch(err => console.log(err))
}

const blog_create = (req,res)=>{
    res.render('create');
}

const blog_save = (req,res)=>{
    const blog = new Blog(req.body);
    blog.save()
    
    .then(result => {console.log(result)
          res.redirect('/')})
    .catch(err => {console.log(err)})
}

const blog_delete = (req, res) => {
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
}

const blog_edit = (req,res)=>{
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
}
const blog_edit_data = (req,res)=>{
    const id = req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('edit',{data:result})    
    })
    .catch(err => console.log(err))    
}

const blog_about = (req,res)=>{
    res.render('about');
}

const blog_main = (req,res) =>{
    res.render('main');
}
console.log("HERjdE")

const blog_verify = (req,res) =>{
    console.log("HERjdE")

    const email = req.body.email;
    const crypto_token = () =>{
        return crypto.randomBytes(32).toString('hex')};
    
    const token = crypto_token()
    const storage = {};
    storage[email] = token;

    const emailContent = `Click the following link to verify your email:
    <a href="https://example.com/verify?token=${token}">Verify Email</a>`;    
    
    const params = {
        Destination:{
            ToAddresses:[email]
        },
        Message:{
                Body:{
                    Html:{
                        Charset:'UTF-8',
                        Data:emailContent
                    },
                },
                Subject:{
                    Charset:'UTF-8',
                    Data:'Email Verification'
                }
        },
        Source:'gagan10223@Gmail.com'
    }
    const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
    sendPromise
    .then(function (data) {
        console.log('Verification email sent. Message ID:', data.MessageId);
        res.send('Verification email sent. Check your inbox.');
    })
    .catch(function (err) {
        console.error('Email send error:', err, err.stack);
        res.status(500).send('Error sending email');
    });
}





module.exports = {
    blog_index,
    blog_details,
    blog_create,
    blog_save,
    blog_delete,
    blog_edit,
    blog_edit_data,
    blog_about,
    blog_main,
    blog_verify
}


