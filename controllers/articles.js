const Article = require('../models/Article');
const Category = require("../models/Category")


module.exports.createArticle = async ( req, res) => {
    try{
        if(!req.body.article) throw new Error("No articles data");
        const data = req.body.article;
        if(!data.title) throw new Error('Article title is required');
        if(!data.content) throw new Error("Article body is required");
        if(!data.author) throw new Error("Article author is required");

        let article = await Article.create({
            title: data.title,
            content: data.content,
            author: data.author,
        });
        let articleID = article.id;
        if (data.catList){
            for ( let t of data.catList) {
                let catExists = await Category.findByPk(t);
                let newCat; 
                if (!catExists) {
                    // newCat = await new Category.create({name: t});
                    // article.addCategory(newCat);
                    continue;
                } else {
                    article.addCategory(catExists);
                }
            }
        }
  
    article = await Article.findByPk (articleID, {include: Category});
    res.status(201).json({article});

} catch (e){
    return res.status(422).json({
        errors: {body: ['Could not create article', e.message]}
    })
}
}
module.exports.getSingleArticleById = async (req, res ) => {
    try{
        const{id} = req.params;
        console.log("Hello");
        console.log(id)
        let article = await Article.findByPk(id, {include: Category});
        article.content = article.content ? article.content.replace("/n", "\n") : "";
        res.status(200).json({article});
    } catch (e) {
        return res.status(422).json({
            errors: {body: ['Could not get articles', e.message]}
        })
    }
}

module.exports.updateArticle = async (req, res) =>{
    try {
        if(!req.body.article) throw new Error('No articles data');
        const data = req.body.article;
        const idInfo = req.params.id;
        let article = await Article.findByPk(id, {include: Category});

        if(!article) {
            res.status(404);
            throw new Error('Article not found')
        }

        const title = data.title ? data.title : article.title;
        const content = data.content? data.content : article.content;
        const author = data.author ? data.author : article.author;
        
        const UpdatedArticle = await article.update({id, title, author, content})
        res.status(200).json({article});

    } catch (e) {
        const code = res.statusCode ? res.statusCode:422;
        return res.status(code).json(
           { 
               errors: {
                body: ['Could not update article', e.message]
                },
           });
    }
}

module.exports.deleteArticle = async (req, res) => {
    try{
        const idInfo = req.params.id;
        let article = await Article.findByPk(idInfo, {include:Category});
        
        if (!article) {
            res.status(404);
            throw new Error("Article not found");

        }
        
        await Article.destroy({where: {id: idInfo}});
        res.status(200).json({message: 'Article deleted successfully'});

    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res. status(code).json({
            errors: {body: ['Could not delete article', e.message]}
        })
    }
}

module.exports.getAllArticles = async (req, res) => {
    try{
        const {category, author, limit = 20, offset = 0} = req.query;
        let article;
        if (!author & category) {
            article = await Article.findAll({
                include: [
                    {
                       model: Category,
                       attributes: ['name'],
                       where : {name:category},
                    },
                ],      
                attributes: { includes: ["createdAt"] }    
            })
        } else if (author && !category) {
            article = await Article.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['name'],
                    }
                ],
                attributes: { includes: ["createdAt"] } 
            })
        } else if (author && category) {
            article = await Article.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['name'],
                        where: {name: category}
                    }
                ],
                attributes: { includes: ["createdAt"] } 
            }) 
        } else {
            article = await Article.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ["name"]
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset)
                // attributes: { includes: ["createdAt"] } 
            })
        }
        res.json({article});
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Could not create article', e.message]}
        })
    }
} 
