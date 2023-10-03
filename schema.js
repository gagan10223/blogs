const mon = require('mongoose');
const Schema = mon.Schema;

const Note = new Schema(
    {
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

const Blog = mon.model('blog',Note);

module.exports = Blog;