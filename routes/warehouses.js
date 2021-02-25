const express    = require('express')
const fs         = require('fs')
const h          = require('../helper-functions')
const {v4: uuid} = require('uuid');
const cors      = require('cors');
const router    = express.Router()

/* import the data */
const warehouses = require('../data/warehouses.json')

/* GET ALL WAREHOUSES */
router.get('/', (req, res)=>{
    res.status(200).json(warehouses)
})

/* GET A SINGLE WAREHOUSE */
router.get('/:id', (req,res)=>{
    const warehouse = warehouses.find(w => w.id === req.params.id)
    warehouse ? res.status(200).json(warehouse) : res.status(404).send("We couldn't find a warehouse with that ID")
})

/* ADD NEW WAREHOUSE */
router.post('/', (req, res)=>{
    const warehouse = req.body

    // check for invalid inputs
    let invalidProperties = h.validateProperties(warehouse)
    if(invalidProperties.length > 0){
        res.status(400).json({
            message:'your request was either missing some information, or included some invalid information',
            incorrectProperties: invalidProperties
        })
    }

    // assign an id and push into warehouse array
    let id = uuid()
    warehouse.id = id
    warehouses.push(warehouse)

    // write to file and respond with the new warehouse
    fs.writeFile('./data/warehouses.json', JSON.stringify(warehouses), (err)=>console.log(err))
    let newWarehouse = warehouses.find(w => w.id === id)
    res.status(200).json(newWarehouse)
})


/* EDIT A WAREHOUSE */
router.patch('/:id', (req,res)=>{
    // find the warehouse to edit and remove it from the database
    let id = req.params.id
    let warehouse = warehouses.find(w => w.id === id)
    let index = warehouses.indexOf(warehouse)
    warehouses.splice(index, 1)

    // check for invalid inputs
    let newWarehouse = req.body
    let invalidProperties = h.validateProperties(newWarehouse)
    if(invalidProperties.length > 0){
        res.status(400).json({
            message:'your request was either missing some information, or included some invalid information',
            incorrectProperties: invalidProperties
        })
    }

    // push the edited version into the database, write to file and return the edited version
    warehouses.push(newWarehouse)
    fs.writeFile('./data/warehouses.json', JSON.stringify(warehouses), (err)=>console.log(err))
    let newWarehouseinDatabase = warehouses.find(w => w.id === id)
    res.status(200).json(newWarehouseinDatabase)
})

/* DELETE A WAREHOUSE */
router.delete('/:id', (req,res)=>{
    // find the warehouse to delete and remove it from the database
    console.log(req.params.id)
    for (let i = 0; i <warehouses.length; i++){
        let currentWarehouse = warehouses[i];
        if(currentWarehouse.id == req.params.id) {
            warehouses.splice(i, 1);
            return res.json(warehouses)
        }
    }
    res.status(404).send (`The warehouse with an id of ${(req.params.id)} does not exist`);

    fs.writeFile('./data/warehouses.json', JSON.stringify(warehouses), (err)=>console.log(err))
    res.status(200).json(warehouses)
})


module.exports = router