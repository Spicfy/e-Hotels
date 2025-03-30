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

app.put("/api/customer/:id", async (req, res) => {
    const { id } = req.params;
  const { full_name, password, address, id_type, registration_date } = req.body;

  try {
    // Fetch existing customer data
    const existingCustomer = await pool.query(
      `SELECT * FROM customers WHERE customer_id = $1`,
      [id]
    );

    if (existingCustomer.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // Get current data and only update if new values are provided
    const currentCustomer = existingCustomer.rows[0];

    const updatedFullName = full_name || currentCustomer.full_name;
    const updatedPassword = password || currentCustomer.password;
    const updatedAddress = address || currentCustomer.address;
    const updatedIdType = id_type || currentCustomer.id_type;

    // Do NOT update registration_date unless explicitly provided
    const updateQuery = `
      UPDATE customers
      SET full_name = $1,
          password = $2,
          address = $3,
          id_type = $4
      WHERE customer_id = $5
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [
      updatedFullName,
      updatedPassword,
      updatedAddress,
      updatedIdType,
      id,
    ]);

    res.json({
      message: "Customer updated successfully!",
      customer: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating customer." });
  }
  });

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
        res.json({ message: "Customer added successfully!" });

    }catch(error){ 
        console.error(error.message)
    }
}) 

app.delete("/api/customer/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        `DELETE FROM customers WHERE customer_id = $1 RETURNING *`,
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Customer not found." });
      }
  
      res.json({ message: "Customer deleted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting customer." });
    }
  });
app.post('/api/employee', async (req, res) => {
    
    
    try{
         const {full_name, address, password,ssn_sin,hotel_id} = req.body;
 
          
         
         console.log(full_name);
         console.log(address);
          console.log(password);
          console.log(ssn_sin);


         
         if(!full_name || !address || !ssn_sin||!password||!hotel_id){
        
             
             
             return res.status(400).json({message: "Name, address and hotel id are required"}); //bad request
         }
         const newCustomer = await pool.query(
             "INSERT INTO employees(full_name, address, ssn_sin,hotel_id,password) VALUES($1, $2, $3,$4,$5) RETURNING *",
             [full_name,address,ssn_sin,hotel_id,password] //value to be inserted
         )
         res.json({ message: "Employee added successfully!" });

     }catch(error){ 
         console.error(error.message)
     }
 }) 
 app.delete("/api/employee/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        `DELETE FROM employees WHERE employee_id = $1 RETURNING *`,
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Employee not found." });
      }
  
      res.json({ message: "Employee deleted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting Employee." });
    }
  });

  app.put('/api/employee/:employee_id', async (req, res) => {
    const { employee_id } = req.params; // Get employee ID from URL params
    const { full_name, password, address, ssn_sin, hotel_id } = req.body;
    // console.log(full_name);
    // console.log(address);
    // console.log(password);
    // console.log(ssn_sin);
    // console.log(hotel_id);
    // console.log(employee_id);
    const existingEmployee = await pool.query( 
        `SELECT * FROM employees WHERE employee_id = $1`,
        [employee_id] 
      );
  
      if (existingEmployee.rows.length === 0) {
        return res.status(404).json({ error: "Employee not found." });
      }
  
      // Get current data and only update if new values are provided
      const currentEmployee = existingEmployee.rows[0];
  
      const updatedFullName = full_name || currentEmployee.full_name;
      const updatedPassword = password || currentEmployee.password;
      const updatedAddress = address || currentEmployee.address;
      const updatedSSN = ssn_sin || currentEmployee.ssn_sin;
        const updatedHotelID = hotel_id || currentEmployee.hotel_id;
    
    
    try {
      // Step 1: Use a nested query to update employee if hotel_id exists
      const updateQuery = `
        UPDATE employees
        SET full_name = $1, password = $2, address = $3, ssn_sin = $4, hotel_id = $5
        WHERE employee_id = $6
        AND EXISTS (
          SELECT 1 FROM hotels WHERE hotel_id = $5
        )
        RETURNING *;
      `;
      
      const updateValues = [updatedFullName, updatedPassword, updatedAddress, updatedSSN, updatedHotelID, employee_id];
      const updateResult = await pool.query(updateQuery, updateValues);
  
      if (updateResult.rowCount === 0) {
        return res.status(400).json({ message: "Hotel not found or Employee not updated." });
      }
  
      // Step 2: Return the updated employee
      res.json({
        message: "Employee updated successfully!",
        employee: updateResult.rows[0],
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating employee." });
    }
  });
  

  app.post("/api/room", async (req, res) => {
    try {
        const { hotel_id, price, amenities, capacity, sea_view, extendable, damages, room_number } = req.body;
        const amenitiesArray = amenities ? amenities.split(",").map(item => item.trim()) : [];
      console.log(amenitiesArray);
        
        const result = await pool.query(
            `INSERT INTO rooms (hotel_id, price, amenities, capacity, sea_view, extendable, damages, room_number)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [hotel_id, price, amenitiesArray, capacity, sea_view, extendable, damages, room_number]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    } 
});

app.put("/api/room/:id", async (req, res) => {
    try {
        const roomId = req.params.id;
        const existing = await pool.query("SELECT * FROM rooms WHERE room_id = $1", [roomId]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Room not found" });
        }

       const { hotel_id, price, amenities, capacity, sea_view, extendable, damages, room_number } = req.body;

        const amenitiesArray = amenities ? amenities.split(",").map(item => item.trim()) : existing.rows[0].amenities;
        const updatedPrice = price || existing.rows[0].price;
        const updatedCapacity = capacity || existing.rows[0].capacity;
        const updatedSeaView = sea_view !== undefined ? sea_view : existing.rows[0].sea_view;
        const updatedExtendable = extendable !== undefined ? extendable : existing.rows[0].extendable;
        const updatedDamages = damages || existing.rows[0].damages;
        const updatedRoomNumber = room_number || existing.rows[0].room_number;
        const updatedHotelId = hotel_id || existing.rows[0].hotel_id;

        const result = await pool.query(
            `UPDATE rooms SET hotel_id = $1, price = $2, amenities = $3, capacity = $4,
            sea_view = $5, extendable = $6, damages = $7, room_number = $8 WHERE room_id = $9 RETURNING *`,
            [updatedHotelId, updatedPrice, amenitiesArray, updatedCapacity, updatedSeaView, updatedExtendable, updatedDamages, updatedRoomNumber, roomId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.delete("/api/room/:id", async (req, res) => {
    try {
        const roomId = req.params.id;
        const result = await pool.query("DELETE FROM rooms WHERE room_id = $1 RETURNING *", [roomId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Room not found" });
        }
        res.json({ message: "Room deleted successfully", room: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
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

app.post('/api/register', async (req, res) => {
    try{

    }
    catch(error){
        console.error(error.message)
    }
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

