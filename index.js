const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

const {notFound, errorHandler} = require('./middleware/errorHandler')
const sequelize = require('./dbConnection')

const Article = require('./models/Article')
const Category = require('./models/Category')

const articleRoutes = require('./routes/articles')
const categoryRoutes = require('./routes/categories')

const app = express()

//CORS 
app.use(cors({credentials:true, origin:true}))

Article.belongsToMany(Category, {through: "CatList", uniquekey: false, timestamps: false})
Category.belongsToMany(Article, {through: "CatList", uniquekey: false, timestamps: false})


const sync = async () => await sequelize.sync({alter: true})
sync()

app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (req,res)=>{
    res.json({status:"frontend"})
});


app.use('/articles', articleRoutes)
app.use('/categories', categoryRoutes)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:8080`)
})