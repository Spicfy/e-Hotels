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
app.post('/api/rentals/payments', async(req, res) => {
    try{
        const {renting_id, amount} = req.body;

        if(!renting_id || !amount) {
            return res.status(400).json({ message: 'Renting ID and Amount are required'})
        }
        await pool.query('CALL register_payment($1, $2)', [renting_id, amount]);

        res.json({success: true, message: 'Payment'})
    } catch(error) {
        console.error(error.message);
        res.status(500).json({success: false, message: 'Failed to process payment', error: error.message});
    }
});
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
    try {
        const { full_name, address, password, id_type } = req.body;

        console.log('收到的请求数据为:', req.body); // 添加此日志

        if (!full_name || !address || !id_type || !password) {
            return res.status(400).json({ message: "Name, address and id_type are required" });
        }

        const newCustomer = await pool.query(
            "INSERT INTO customers(full_name, password, address, id_type) VALUES($1, $2, $3, $4) RETURNING *",
            [full_name, password, address, id_type]
        );

        res.status(201).json({ message: "Customer registered successfully!", customer: newCustomer.rows[0] });

    } catch (error) {
        console.error("后端执行出错:", error.message);  // 明确输出此错误消息
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

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

app.post('/api/hotel', async (req, res) => {
    try{ 
        const {employee_id, chain_id, name, stars, address, contact_email, contact_phone } = req.body;
        const newHotel = await pool.query(
            "INSERT INTO hotels(chain_id, name, stars, address, contact_email, contact_phone,manager_id) VALUES($1, $2, $3, $4, $5, $6,$7) RETURNING *",
            [chain_id, name, stars, address, contact_email, contact_phone,employee_id] //value to be inserted
        )
        res.json({ message: "Hotel added successfully!" });
    }catch(error){
        console.error(error.message)
    }
})    

app.put('/api/hotel/:hotel_id', async (req, res) => {
    try{
        const {hotel_id} = req.params;
        console.log(hotel_id);
        
        const {employee_id, chain_id, name, stars, address, contact_email, contact_phone } = req.body;
        
        const existingHotel = await pool.query(
            `SELECT * FROM hotels WHERE hotel_id = $1`,
            [hotel_id] 
        )
        const updatedEmployee_id = employee_id || existingHotel.rows[0].manager_id;
        const updatedChain_id = chain_id || existingHotel.rows[0].chain_id;
        const updatedName = name || existingHotel.rows[0].name;
        const updatedStars = stars || existingHotel.rows[0].stars;
        const updatedAddress = address || existingHotel.rows[0].address;
        const updatedContact_email = contact_email || existingHotel.rows[0].contact_email;
        const updatedContact_phone = contact_phone || existingHotel.rows[0].contact_phone;

        // console.log(updatedEmployee_id);
        // console.log(updatedChain_id);
        // console.log(updatedName);
        // console.log(updatedStars);
        // console.log(updatedAddress);
        // console.log(updatedContact_email);
        // console.log(updatedContact_phone);
        // console.log(hotel_id);
        
        const updateHotel = await pool.query(
            "UPDATE hotels SET manager_id = $1, chain_id = $2, name = $3, stars = $4, address = $5, contact_email = $6, contact_phone = $7 WHERE hotel_id = $8 RETURNING *",
            [updatedEmployee_id, updatedChain_id, updatedName, updatedStars, updatedAddress, updatedContact_email, updatedContact_phone, hotel_id]
        );
        res.json({
            message: "Hotel updated successfully!"});
    }catch(error){
        console.error(error.message)
        res.status(500).json({message: "Error updating hotel"})
    }
})

app.delete('/api/hotel/:hotel_id', async (req, res) => {
    try{
        const {hotel_id} = req.params;
        
        const deleteHotel = await pool.query(
            "DELETE FROM hotels where hotel_id = $1 RETURNING *",
            [hotel_id]
        );
 
        if(deleteHotel.rowCount === 0){
            return res.status(404).json({message: "Hotel not found"});
        }
        res.json({message: "Hotel deleted successfully", deletedHotel: deleteHotel.rows[0]});
    }catch(error){
        console.error(error.message)
        res.status(500).json({message: "Error deleting hotel"})
    }
})


app.get('/api/roomsbyarea', async (req, res) => {
    try{
        const { area } = req.query;
        
        const allRooms = await pool.query("SELECT available_rooms_count FROM available_rooms_per_area WHERE area = $1", [area]);
        if (allRooms.rows.length === 0) {
            
            return res.status(404).json({ message: "Hotel not found" });
        }
        console.log(allRooms.rows[0]);
        
        //console.log(allRooms.rows);
        

        res.json(allRooms.rows[0]); 
        
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
    const { startDate, endDate, capacity, area, hotelChain, hotel_name, category, maxPrice, sortBy } = req.query;

    let query = "SELECT * FROM available_rooms WHERE 1=1";

    if (startDate && endDate) {
        query += ` AND NOT EXISTS (SELECT 1 FROM bookings WHERE available_rooms.room_id = bookings.room_id AND (check_in_date BETWEEN '${startDate}' AND '${endDate}' OR check_out_date BETWEEN '${startDate}' AND '${endDate}'))`;
    }
    if (capacity) query += ` AND capacity >= ${capacity}`;
    if (area) query += ` AND area = '${area}'`;
    if (hotelChain) query += ` AND hotel_chain = '${hotelChain}'`;
    if (hotel_name) query += ` AND hotel_name = '${hotel_name}'`;
    if (category) query += ` AND hotel_category = ${category}`;
    if (maxPrice) query += ` AND price <= ${maxPrice}`;

    if (sortBy === "price_asc") query += " ORDER BY price ASC";
    else if (sortBy === "price_desc") query += " ORDER BY price DESC";
    else if (sortBy === "capacity_asc") query += " ORDER BY capacity ASC";
    else if (sortBy === "capacity_desc") query += " ORDER BY capacity DESC";

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).send("Server error");
    }
});
// Booking Endpoint
app.post('/api/bookings', async(req, res) => {
    try{
        const { customer_id, room_id, check_in_date, check_out_date } = req.body;

        if (!customer_id || !room_id || !check_in_date || !check_out_date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const result = await pool.query(
            'INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING booking_id',
            [customer_id, room_id, check_in_date, check_out_date, 'confirmed']
        );

        res.json({ success: true, message: 'Booking created successfully!', booking_id: result.rows[0].booking_id });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ success: false, message: 'Failed to create booking.', error: error.message });
    }
});

app.listen(5000, () => console.log("Server is running on port 5000"));





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
app.get('/api/customers/:customer_id', async (req, res) => {
    const {customer_id} = req.params;
    try{
        const existingCustomer = await pool.query('SELECT * FROM customers WHERE customer_id = $1',[customer_id]);

        if(existingCustomer.rows.length === 0) {
            return res.status(404).json({message: 'Customer not found.'});
        }

        res.status(200).json(existingCustomer.rows[0]);
    } catch(error){
        console.error('Error fetching customer:', error);
        res.status(500).json({message: 'Internal server error. '});
    }
});
app.get('/api/employee/:employee_id', async(req, res) => {
    const {employee_id} = req.params;
    try{
        const existingEmployee = await pool.query('SELECT * FROM employees WHERE employee_id = $1', [employee_id]);
        if(existingEmployee.rows.length ===0){
            return res.status(404).json({message: 'Customer not found.' });
        }

        res.status(200).json(existingEmployee.rows[0]);
        
    }catch(error){
        console.error('Error fetching employee:', error);
        res.status(500).json({message: 'Internal server error.'});
    }
})

app.get('/api/bookings', async(req, res) => {
    try{
        const result = await pool.query('SELECT * FROM bookings');

        res.status(200).json(result.rows);

    } catch(error){
        console.error('Error fetching bookings:', error);
        res.status(500).json({message: 'Internal server error.'});
    }
})
app.post('/api/login', async (req, res) => {
    const { full_name, password } = req.body;

    if (!full_name || !password) {
        return res.status(400).json({ message: "Full name and password are required." });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM customers WHERE full_name = $1 AND password = $2",
            [full_name, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // You can add JWT token generation here in the future
        res.status(200).json({ message: "Login successful!", customer: result.rows[0] });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Server error during login." });
    }
});
app.post('/api/employee', async (req, res) => {
    try {
        let { full_name, address, password, ssn_sin, hotel_id } = req.body;

        hotel_id = parseInt(hotel_id); // ✅ 强制转换为整数

        console.log(full_name, address, password, ssn_sin, hotel_id);

        if (!full_name || !address || !ssn_sin || !password || isNaN(hotel_id)) {
            return res.status(400).json({ message: "All fields are required and hotel_id must be valid." });
        }

        const newEmployee = await pool.query(
            "INSERT INTO employees(full_name, address, ssn_sin, hotel_id, password) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [full_name, address, ssn_sin, hotel_id, password]
        );

        res.status(201).json({ message: "Employee registered successfully!", employee: newEmployee.rows[0] });

    } catch (error) {
        console.error("Employee registration error:", error.message);
        res.status(500).json({ message: "Server error during employee registration." });
    }
});
app.post('/api/employee/login', async (req, res) => {
    const { ssn_sin, password } = req.body;

    if (!ssn_sin || !password) {
        return res.status(400).json({ message: "SSN/SIN and password are required." });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM employees WHERE ssn_sin = $1 AND password = $2",
            [ssn_sin, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        res.status(200).json({ message: "Login successful!", employee: result.rows[0] });

    } catch (err) {
        console.error("Employee login error:", err.message);
        res.status(500).json({ message: "Server error during employee login." });
    }
});
app.get('/api/filters/areas', async (req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT address AS area FROM hotels");
        res.json(result.rows.map(row => row.area));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/filters/hotels', async (req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT name FROM hotels");
        res.json(result.rows.map(row => row.name));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/filters/hotels', async (req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT name FROM hotels");
        res.json(result.rows.map(row => row.name));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/filters/chains', async (req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT name FROM hotel_chains");
        res.json(result.rows.map(row => row.name));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/filters/categories', async (req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT stars FROM hotels ORDER BY stars");
        res.json(result.rows.map(row => row.stars));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(5000, () => {
    console.log("Server is running on port 5000");

})

