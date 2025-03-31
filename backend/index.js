require('dotenv').config();
const express = require('express');
const app = express();

const cors=require('cors')
app.use(express.json()); //req.body
const pool = require('./db');

const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');





app.use(cors())
app.use(express.json());

function generateToken(user){
    return jwt.sing(
        
    )
}
app.post('/api/bookings', async(req, res) => {
    try{
        const {customer_id, room_id, check_in_date, check_out_date} = req.body;

        if(!customer_id || room_id, check_in_date, check_out_date){
            return res.status(400).json({message: 'Missing required fields'});
        }
        const result = await pool.query(
            'INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date,  status)   VALUES ($1, $2, $3, $4, $5) RETURNING booking_id',
            [customer_id, room_id, check_in_date, check_out_date, 'confirmed'] 
        );
        const booking_id = result.rows[0].booking_id;

        res.json({success: true, message: 'Booking created successfully!', booking_id:
            booking_id
        });
    } catch(error){
        console.error(error.message);
        res.status(500).json({success: false, message: 'Failed to create booking.',
            error: error.message
        });
    }
})
app.post('/api/rentals/payment', async (req, res) => {
    try{
        const {renting_id, amount} = req.body;

        if(!renting_id || !amount){
            return res.status(400).json({message: 'Renting ID and Amount are required'})
        }

        await pool.query('CALL register_payment($1, $2)', [renting_id, amount]);

        res.json({success: true, message: 'Payment'})
    }
})
app.post('/api/rentals/convert', async (req, res) => {
    try{
        const {booking_id, employee_id} = req.body;

        if(!booking_id || !employee_id){
            return res.status(400).json({message: 'Booking ID and Employee ID are required'});


        }
        await pool.query('CALL convert_booking_to_rental($1, $2)', [booking_id,employee_id]);
        res.json({success: true, message: 'Booking converted to rental successfully!' })
    } catch(error){
     
        res.status(500).json({success: false, message: 'Failed to convert booking to rental',
            error: error.message
        });
    }
})
app.post('/api/rentals/payments', async(req, res) => {
    try{
        const {renting_id, amount} = req.body;

        if(!renting_id || !amount) {
            return res.status(400).json({ message: 'Renting ID and Amount are required'})
        }
        await pool.query('CALL register_payment($1, $2', [renting_id, amount]);

        res.json({success: true, message: 'Payment successful!'});
    } catch(error){
        console.error(error.message);
        res.status(500).json({success: false, message: 'Failed to process payment',
            error: error.message
        });
    }
})

app.post('/api/rentals/direct', async(req, res) => {
    try{
        const {customer_id, room_id, employee_id , check_in_date , check_out_date} = req.body;

        if(!customer_id || !room_id || !employee_id || !check_in_date || !check_out_date){
            return res.status(400).json({message: 'Missing required fields'});
        }

        await pool.query('CALL direct_rental($1, $2, $3, $4, $5)', [customer_id, room_id, employee_id, check_in_date, check_out_date]);
        res.json({success:true, message: 'Direct rental successful!'});
    }  catch(error){
        console.error(error.message);
        res.status(500).json({success: false, message: 'Failed to process direct rental',
            error: error.message
        });
    }
})


app.post('/api/customer', async (req, res) => {
    
    
   try{
        const {full_name, address, password,id_type} = req.body;

         
        
        // console.log(full_name);
        // console.log(address);
        // console.log(password);
        // console.log(id_type);
        
        if(!full_name || !address || !id_type||!password){
            
            
            
            return res.status(400).json({message: "Name, address and id_type are required"}); //bad request
        }
        const newCustomer = await pool.query(
            "INSERT INTO customers(full_name, password, address, id_type) VALUES($1, $2, $3,$4) RETURNING *",
            [full_name, password,address, id_type] //value to be inserted
        )
    }catch(error){ 
        console.error(error.message)
    }
}) 

app.post('/api/employee', async (req, res) => {
    
    
    try{
         const {full_name, address, password,ssn_sin,hotel_id} = req.body;
 
          
         
         console.log(full_name);
         console.log(address);
          console.log(password);
          console.log(ssn_sin);

console.log(hotel_id);
         
         if(!full_name || !address || !ssn_sin||!password||!hotel_id){
        
             
             
             return res.status(400).json({message: "Name, address and hotel id are required"}); //bad request
         }
         const newCustomer = await pool.query(
             "INSERT INTO employees(full_name, address, ssn_sin,hotel_id,password) VALUES($1, $2, $3,$4,$5) RETURNING *",
             [full_name,address,ssn_sin,hotel_id,password] //value to be inserted
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
app.get("/api/available-rooms", async (req, res) => {
    const { startDate, endDate, capacity, area, hotelChain, category, maxPrice } = req.query;
    
    console.log(capacity);
    
    let query = "SELECT * FROM available_rooms WHERE 1=1";


    if (startDate && endDate) {
        console.log(startDate);
        
        query += ` AND NOT EXISTS (SELECT 1 FROM bookings WHERE available_rooms.room_id = bookings.room_id AND (check_in_date BETWEEN '${startDate}' AND '${endDate}' OR check_out_date BETWEEN '${startDate}' AND '${endDate}'))`;
        
    }
    if (capacity) {
        query += " AND capacity >="+capacity;
        
    }
    if (area) {
        query += ` AND area = '${area}'`;
        
    }
    if (hotelChain) {
        query += ` AND hotel_name = '${hotelChain}'`;
    
    }
    if (category) {
        query += " AND hotel_category = "+category;
        
    }
    if (maxPrice) {
        query += " AND price <= "+maxPrice;
 
    }
    console.log(query);
    
    try {
        
        const result = await pool.query(query);
        res.json(result.rows); 
    } catch (error) {
        console.log(2); 
        
        console.error("Error fetching rooms:", error);
        res.status(500).send("Server error");
    }
});

//Routes

app.post('/api/register/customer', async (req, res) => {
    
    

    
    try{
        const { full_name, address, password, id_type} = req.body;
       
       
        const customer = await User.createCustomer(full_name, address, password, id_type);
        res.status(201).json({message: 'Customer registered successfully', customer});

    }
    catch(error){
       res.status(500).json({message: error.message});
    }
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

