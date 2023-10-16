const {Blog} = require('../schema');
const {Email} = require('../schema');
const {Users} = require('../schema');

const crypto = require('crypto');
const AWS = require('aws-sdk');

AWS.config.update({region:'us-east-1'});


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
        return crypto.randomBytes(4).toString('hex')};
    
    const token = crypto_token()
    const storage = {};
    storage[email] = token;

    const emailContent = `Your verification token: ${token}`;  
    
    Email.create({email:email, token: token})
    .then( result => {
        console.log(token)
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
            Source:'blogs@gagandeep.pro'
        }
        const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
        sendPromise
        .then(function (data) {
            console.log('Verification email sent. Message ID:', data.MessageId);
            res.render('next',{token,email})
        })
        .catch(function (err) {
            console.error('Email send error:', err, err.stack);
            res.status(500).send('Error sending email');
        });
    })
    .catch(err =>{
        console.error('Error creating the email document', err);
        res.status(500).send('Error sending the email')
        })   
}
const blog_next = (req, res) => {
    console.log('here')
    
    const username = req.body.username;
    const password = req.body.password;
    const confirmation = req.body.confirmation;
    const token = req.body.token;
    const email = req.body.email;
    console.log(password)
    console.log(email)
    console.log(token)
    Email.find()
    .then(result =>{
        console.log(result)
    })
    .catch(err =>{
        console.log(err)
    })
    Email.find({ email: email })
    .then(result =>{
        console.log(result)
    })


    const containsWhitespace = (input) => /\s/.test(input);

    if (containsWhitespace(username) || containsWhitespace(password) || containsWhitespace(confirmation)) {
        console.log('Error: Username, password, or confirmation contains whitespace');
    } else {
        Email.find({ email: email })
            .then((db_token) => {
                console.log(db_token)
                if (db_token) {
                    console.log(db_token.token)
                    if (db_token.token === token) {
                        
                        Users.create({ username: username, password: password })
                            .then((result) => {
                                Email.findByIdAndDelete(db_token.id)
                                    .then(() => {
                                        res.render('user_success',{'message':'User succesfully created'})
                                        console.log('User successfully created');
                                    })
                                    .catch((err) => {
                                        console.error('Error deleting email record:', err);
                                    });
                            })
                            .catch((err) => {
                                console.error('Error creating the user:', err);
                            });
                    } else {
                        console.log('Error: Invalid token');
                    }
                } else {
                    console.log('Error: Email not found in the database');
                }
            })
            .catch((err) => {
                console.error('Error finding the email document:', err);
            });
    }
};

const blog_login = (req,res) =>{
    res.render('login')
}

const verify_login = (req,res) =>{
    const username = req.body.username;
    const password = req.body.password;

    Users.find({username:username,password:password})
    .then(result =>{
        console.log('here')
        res.redirect('/')
    })
    .catch(err =>{
        console.log('Invalid username or Password')
    })
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
    blog_verify,
    blog_next,
    blog_login,
    verify_login
}


