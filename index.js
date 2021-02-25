
const cors    = require('cors')
const warehouses = require('./routes/warehouses')
const inventory = require('./routes/inventory')
const path = require('path')
const express = require('express')
const app     = express()
require('dotenv').config()

/* middlewear */
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')));

/* routes */
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
app.use('/warehouses', warehouses)
app.use('/inventory', inventory)

/* listen */
app.listen(process.env.PORT, ()=> console.log(`running on ${process.env.PORT}`))