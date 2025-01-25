const ensureAuthenticated = require('../Middlewares/Auth');

const ProductRouter = require('express').Router();

ProductRouter.get('/',ensureAuthenticated, (req,res)=>{
    

    res.status(200).json([
        {
            name:"mobile",
            price: 100
        },
        {
            name: "tv",
            price:20000
        }
      
    ])

});


module.exports = ProductRouter;
