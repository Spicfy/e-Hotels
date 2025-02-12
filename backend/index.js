const express = require('express');
const app = express();

const cors=require('cors')
app.use(express.json()); //req.body
const pool = require('./db');






app.use(cors())
app.use(express.json());



app.post('')
app.get('/api/hotel-chains', async (req, res) => {
    //await
    try{
        console.log(req.body)


    }catch(error){
        console.error(error.message)
    }
} )

//Routes



app.listen(3000, () => {
    console.log("Server is running on port 3000");
})