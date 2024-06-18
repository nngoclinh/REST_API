const pool = require('../../db');
const queries = require('./queries');

const getStudents = (req,res) => {
    pool.query(queries.getStudents,(error,results)=>{
        if(error)  throw error;
        res.status(200).json(results.rows);
    });
};

const getStudentsById = (req,res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getStudentsById, [id] ,(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};  
//add to database
const addStudents = (req,res) => {
    const { name , email, age, dob} = req.body;
    //check email exists
    pool.query(queries.checkEmailExists,[email],(error,results)=>{
        if(results.rows.length) {
            res.send("Email already existed");
        }
    //add students
    pool.query(queries.addStudents,[name , email, age, dob], (error,results) =>{
        if(error) throw error;
        res.status(201).send("Students added");
        console.log("Students created"); 
    }) 
    });
};

const removeStudents =(req,res) => {
    const id =parseInt(req.params.id);
    pool.query(queries.getStudentsById, [id], (error, results)=>{
        const noStudentFound = !results.rows.length;
        if(noStudentFound){
                res.send("No students found! Couldn't remove");
            }
    else{        
    pool.query(queries.removeStudents,[id],(error,results)=>{
        if (error) throw error;
        res.status(200).send("Students removed");
    
    });
    }
    });
};

const updateStudents = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, dob, email } = req.body;

    // Object to hold fields and corresponding values for update
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (age !== undefined) updateFields.age = age;
    if (dob !== undefined) updateFields.dob = dob;
    if (email !== undefined) updateFields.email = email;

    // Check if no fields to update
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).send("No fields provided for update.");
    }
    // Constructing the SET part of the SQL query dynamically
    const updateQueryParams = [];
    const updateValues = [];
    let paramIndex = 1;

    for (const key in updateFields) {
        updateQueryParams.push(`${key} = $${paramIndex}`);
        updateValues.push(updateFields[key]);
        paramIndex++;
    }

    updateValues.push(id); // Add id as the last parameter for WHERE clause

    // Query to update the student
    const updateQuery = {
        text: `UPDATE students SET ${updateQueryParams.join(', ')} WHERE id = $${paramIndex}`,
        values: updateValues
    };

    // Execute the update query
    pool.query(queries.getStudentsById, [id], (error, results) => {
        if (error) {
            console.error('Error fetching student:', error);
            return res.status(500).send("Error fetching student.");
        }

        if (!results.rows.length) {
            return res.status(404).send("No student found. Couldn't update.");
        }

        // Perform the update with the dynamically constructed query
        pool.query(updateQuery, (error, results) => {
            if (error) {
                console.error('Error updating student:', error);
                return res.status(500).send("Error updating student.");
            }
            res.status(200).send("Student updated successfully.");
        });
    });
};
module.exports ={
    getStudents,
    getStudentsById, 
    addStudents,
    removeStudents,
    updateStudents,
};