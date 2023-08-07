const express = require('express')
const dbConnect = require('./config/db/dbConnect')
const { userRegisterCtrl, userLoginCtrl } = require('./controllers/users/usersCtr')
const { errorHandler, notFound } = require('./middlewares/error/errorHandler')
const postRoute = require('./route/posts/postRoute')
const userRoutes = require('./route/users/userRoute')

require('dotenv').config()




const app = express()

// DB
dbConnect()


// Middleware
app.use(express.json())


// User Route
app.use("/api/users", userRoutes);

// Post Route
app.use("/api/posts", postRoute);

// Login User
// app.post('/api/users/', userLoginCtrl) 

// Fetch all user
app.get('/api/users', (req, res) => {
    res.json('Fetched all users')
})

app.get('/', (req, res) => {
    res.send('hello world')
})



// Error Handler
app.use(notFound)
app.use(errorHandler)

// Server
const PORT = process.env.DB_PORT ||5000
app.listen(PORT, () => {
    console.log('server listening on port ' + PORT);
})

