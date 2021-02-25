const express    = require('express')
const fs         = require('fs')
const h          = require('../helper-functions')
const {v4: uuid} = require('uuid');
const cors      = require('cors');
const router    = express.Router();

router.use(cors());


/* import the data */
const inventories = require('../data/inventories.json');
const warehouses = require('../data/warehouses.json');

router.route('/')
    .get((req,res) => {
        console.log("ROUTE YES");
        res.json(inventories)
    })



/* GET INVENTORY FOR A SINLGE WAREHOUSE*/
router.get('/warehouse/:id', (req, res)=> {
    let inv = inventories.filter(i => i.warehouseID === req.params.id)
    inv.length > 0 ? res.status(200).json(inv) : res.sendStatus(400, 'No inventory associated with that warehouse ID')
})

/* copied format from warehouse *?
/* GET A SINGLE INVENTORY */
router.get('/:id', (req,res)=>{
    const inventory = inventories.find(i => i.id === req.params.id)
    console.log(inventory)
    res.json(inventory) 
})


/* ADD NEW inventory */
router.post('/', (req, res)=>{
    const inventory = req.body
    console.log(inventory)
    let warehouse = warehouses.find((w)=>w.id === inventory.warehouseID)
    console.log(warehouse)
    warehouse ? inventory.warehouseName = warehouse.name : res.status(400).send('invalid warehouse ID') 

    // check for invalid inputs
    let invalidProperties = h.validateProperties(inventory)
    if(invalidProperties.length > 0){
        res.status(400).json({
            message:'your request was either missing some information, or included some invalid information',
            incorrectProperties: invalidProperties
        })
    }

    // assign an id and push into inventory array
    let id = uuid()
    inventory.id = id
    inventories.push(inventory)

    // write to file and respond with the new inventory
    fs.writeFile('./data/inventories.json', JSON.stringify(inventories), (err)=>console.log(err))
    let newInventory = inventories.find(i => i.id === id)
    res.json(newInventory)
})

/* EDIT an inventory */
router.patch('/:id', (req,res)=>{
    // find the inventory to edit and remove it from the database
    let id = req.params.id
    let inventory = inventories.find(i => i.id === id)
    !inventory && res.status(404).send('item does not exist')
    let index = inventories.indexOf(inventory)
    inventories.splice(index, 1)

    // check for invalid inputs
    let newInventory = req.body
    let invalidProperties = h.validateProperties(newInventory)
    if(invalidProperties.length > 0){
        res.status(400).json({
            message:'your request was either missing some information, or included some invalid information',
            incorrectProperties: invalidProperties
        })
    }

    // push the edited version into the database, write to file and return the edited version
    inventories.push(newInventory)
    
    fs.writeFile('./data/inventories.json', JSON.stringify(inventories), (err)=>{
        if(err) console.log(err)

        let newInventoryinDatabase = inventories.find(i => i.id === req.params.id)
        console.log('NEW INV: ', newInventoryinDatabase)
        inventories.push(newInventory)
        res.json(newInventoryinDatabase)
    })

})


/* DELETE an inventory */
router.delete('/:id', (req,res)=>{
    // find the warehouse to delete and remove it from the database
    console.log(req.params.id)
    for (let i = 0; i <inventories.length; i++){
        let currentWarehouse = inventories[i];
        if(currentWarehouse.id == req.params.id) {
            inventories.splice(i, 1);
            return res.json(inventories)
        }
    }
    res.status(404).send (`The invenotry with an id of ${(req.params.id)} does not exist`);

    fs.writeFile('./data/inventories.json', JSON.stringify(inventories), (err)=>console.log(err))
    res.status(200).json(inventories)
})
module.exports = router
