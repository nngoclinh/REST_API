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
    const dobParts = dob.split('/'); // Assuming dob is in dd/mm/yyyy format
    const formattedDob = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
    //check email exists
    pool.query(queries.checkEmailExists,[email],(error,results)=>{
        if(results.rows.length) {
            return res.status(400).json({ error: 'Email already exists' });
        }
    //add students
    pool.query(queries.addStudents,[name , email, age, formattedDob], (error,results) =>{
        if(error) throw error;
        res.status(201).json({ message: 'Student added successfully' });
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

    let setClause = [];
    let values = [];

    if (name !== undefined) {
        setClause.push(`name = $${setClause.length + 1}`);
        values.push(name);
    }
    if (age !== undefined) {
        setClause.push(`age = $${setClause.length + 1}`);
        values.push(age);
    }
    if (dob !== undefined) {
        setClause.push(`dob = $${setClause.length + 1}`);
        values.push(dob);
    }
    if (email !== undefined) {
        setClause.push(`email = $${setClause.length + 1}`);
        values.push(email);
    }

    if (setClause.length === 0) {
        res.status(400).send("No fields provided for update.");
        return;
    }

    const updateQuery = `UPDATE students SET ${setClause.join(', ')} WHERE id = $${values.length + 1}`;
    values.push(id);

    pool.query(queries.getStudentsById, [id], (error, results) => {
        if (error) throw error;
        const noStudentFound = results.rows.length === 0;
        if (noStudentFound) {
            res.status(404).send("No student found. Couldn't update.");
        } else {
            pool.query(updateQuery, values, (error, updateResult) => {
                if (error) {
                    throw error;
                }
                res.status(200).send("Student updated successfully.");
            });
        }
    });
};
module.exports ={
    getStudents,
    getStudentsById, 
    addStudents,
    removeStudents,
    updateStudents,
};