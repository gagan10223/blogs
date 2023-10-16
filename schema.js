const mon = require('mongoose');
const Schema = mon.Schema;

const Note = new Schema(
    {
        username:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        snippet:{
            type:String,
            required:true
        },
        body:{
            type:String,
            required:true
        }

    },{timestamps:true}
)

const email_token = new Schema(
    {
        email:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }
)

const users = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const Blog = mon.model('blog',Note);
const Email = mon.model('Email',email_token)
const Users = mon.model('Users',users)

module.exports = {
    Blog,
    Email,
    Users
}