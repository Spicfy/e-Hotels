require('dotenv').config();
const express = require('express');
const app = express();

const cors=require('cors')
app.use(express.json()); //req.body
const pool = require('./db');






app.use(cors())
app.use(express.json());



app.post('/api/customer', async (req, res) => {
    try{
        const {name, address, id_type} = req.body;

        if(!name || !address || !id_type){
            return res.status(400).json({message: "Name, address and id_type are required"}); //bad request
        }
        const newCustomer = await pool.query(
            "INSERT INTO customer(name, address, id_type) VALUES($1, $2, $3) RETURNING *",
            [name, address, id_type] //value to be inserted
        )
    }catch(error){
        console.error(error.message)
    }
})


app.get('/api/hotel-chains', async (req, res) => {
    try{
        const allChains = await pool.query("SELECT * FROM hotel_chains");
        res.json(allChains.rows);
    }catch(error){
        console.error(error.message)
    }
})
app.post('/api/hotel-chains', async (req, res) => {
    //await
    try{
        const { name, office_address,num_hotels, email, phone  } = req.body;

        if(!name || !office_address){
            return res.status(400).json({message: "Name and office_address are required"}); //bad request
        }

        const newChain = await pool.query(
            "INSERT INTO hotel_chains(name, office_address,num_hotels, email, phone) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [name, office_address,num_hotels, email, phone] //value to be inserted
        )
    }catch(error){
        console.error(error.message)
    }
} )

app.put('/api/hotel-chains/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const {name, office_address, num_hotels, email, phone} = req.body;
        
        const updateChain = await pool.query(
            "UPDATE hotel_chains SET name = $1, office_address = $2, num_hotels = $3, email = $4, phone = $5 WHERE chain_id = $6 RETURNING *",
            [name, office_address, num_hotels, email, phone, id]
        );
    }catch(error){
        console.error(error.message)
        res.status(500).json({message: "Error updating hotel chain"})
    }
})
app.delete('/api/hotel-chains/:id', async (req, res) => {
    try{
        const {id} = req.params;

        const deleteChain = await pool.query(
            "DELETE FROM hotel_chains where chain_id = $1 RETURNING *",
            [id]
        );

        if(deleteChain.rowCount === 0){
            return res.status(404).json({message: "Hotel chain not found"});
        }
        res.json({message: "Hotel chain deleted successfully", deletedCHain: deleteChain.rows[0]});
    }catch(error){
        console.error(error.message)
        res.status(500).json({message: "Error deleting hotel chain"})
    }
})


app.post('/api/hotels', async (req, res) => {
    try{
        const {name, address, chain_id} = req.body;
    }catch(error){
        console.error(error.message)
    }
})

//Routes



app.listen(3000, () => {
    console.log("Server is running on port 3000");
})