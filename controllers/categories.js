const Category = require('../models/Category')

module.exports.getAllCategories = async(req, res) => {
    try{
        const getCategories = await Category.findAll();
        const categories = []
        if (getCategories)
            for(let category of getCategories){
                categories.push(category.dataValues.name)
            }
        res.status(200).json({categories})
    } catch (e) {
        res.status(422).json({errors: {body: [e.message]}})
    }
}