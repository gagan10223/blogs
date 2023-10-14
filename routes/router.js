const express= require('express')

const controller = require('../ctrler/cont')

const routers = express.Router();

routers.get('/', controller.blog_index);

routers.get('/main',controller.blog_main)

routers.get('/create',controller.blog_create)

routers.post('/create',controller.blog_save)

routers.get('/blogs/:id',controller.blog_details)

routers.get('/about',controller.blog_about)

routers.delete('/blogs/:id', controller.blog_delete)

routers.get('/edit/:id',controller.blog_edit_data)

routers.put('/edit/:id',controller.blog_edit)

routers.post('/main',controller.blog_verify)


module.exports = routers;