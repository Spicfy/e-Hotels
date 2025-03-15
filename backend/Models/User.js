const pool = require('../db');
const bcrypt = require('bcrypt');

class User {
    static async createCustomer(full_name, address){
        try{
            //Hash the password
            const salt = await bcrypt.genSalt(10);  // salt is random string that is added to a password before hashing
            const hashedPassword = await bcrypt.hash

            const result = await pool.query (
                "INSERT INTO customer(full_name, password, address, id_type, registration_date) VALUES($1, $2, $3, $4, CURRENT_DATE) RETURNING *"
                [full_name, hashedPassword, address, id_type]
            );

            return result.rows[0];
        } catch(error){
            throw new Error(error.message);
        }
    }

    static async createEmployee(full_name, address, ssn_sin, hotel_id, position){
        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
        
            const result = await pool.query(
                "INSERT INTO employees(full_name, address, password, ssn_sin, hotel_id, position) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
                [full_name, address, hashedPassword, ssn_sin, hotel_id, position]
            );

            return result.rows[0];
        } catch(error){
            throw new Error(error.message);
        }
    }

    static async findEmployeeById(id){
        try{
            const res = await pool.query (
                "SELECT * FROM employees WHERE employee_id = $1",
                [id]
            )
            return res.rows[0];
        } catch(e){
            throw new Error(e.message)
        }
    }

    static async findCustomerById(id){
        try{
            const res = await pool.query(
                "SELECT * FROM customer WHERE customer_id =$1",
                [id] 
            );
            return res.rows[0];
        } catch (error){
            throw new Error(error.message);
        }
    }
    static async findCustomerByName(name){
        try{
            const res = await pool.query(
                "SELECT * FROM customer WHERE full_name =$1",
                [name]
            );
            return res.rows[0];
        } catch(error){
            throw new Error(error.message);
        }
    }

    static async findEmployeeByName(name){
        try{
            const res = await pool.query(
                "SELECT * FROM employees WHERE full_name =$1",
                [name]
            );
            return res.rows[0];
        } catch(error){
            throw new Error(error.message);
        }
    }
    
    static async authenticate(name, password, role){
        try{
            let user;

            if(role === 'customer'){
                user = await this.findCustomerByName(name);
            }else if (role === 'employee'){
                user = await this.findEmployeeByName(name);
            }else{
                throw new Error('Invalid role');
            }

            if(!user){
                return null;
            }

            const validPassword = await bcrypt.compare.compare(password, user.password);
        }
    }




}
