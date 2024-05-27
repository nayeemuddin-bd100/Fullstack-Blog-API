const express = require('express')
const dbConnect = require('./config/db/dbConnect')
const { userRegisterCtrl, userLoginCtrl } = require('./controllers/users/usersCtr')
const { errorHandler, notFound } = require('./middlewares/error/errorHandler')
const categoryRoute = require('./route/category/categoryRoute')
const commentRoute = require('./route/comments/commentRoute')
const postRoute = require('./route/posts/postRoute')
const sendEmailRoute = require('./route/sendEmail/sendEmailRoute')
const userRoutes = require('./route/users/userRoute')
const swaggerUi = require('swagger-ui-express');
// import YAML from 'yamljs';
const swaggerDocument = require('./swagger.json');
const cors = require('cors');


require('dotenv').config()
const app = express()

// DB
dbConnect()

// cors
app.use(cors());
// Middleware
app.use(express.json())
// User Route
app.use("/api/users", userRoutes);

// Post Route
app.use("/api/posts", postRoute);

//Comment Route
app.use('/api/comments', commentRoute)

//sendEmail Route
app.use('/api/sendEmail',sendEmailRoute)

//category Route
app.use('/api/category',categoryRoute)

// Fetch all user
app.get('/api/users', (req, res) => {
    res.json('Fetched all users')
})

app.get('/', (req, res) => {
    res.send('hello world')
})

// Swagger Api docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handler
app.use(notFound)
app.use(errorHandler)

// Server
let PORT = process.env.DB_PORT || 5000
if (process.env.NODE_ENV == "test") {
	PORT = Math.floor(Math.random() * 60000) + 5000;
}


app.listen(PORT, () => {
    console.log('server listening on port ' + PORT);
})


module.exports = app;