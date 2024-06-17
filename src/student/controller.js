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

module.exports ={
    getStudents,
    getStudentsById, 
    addStudents,
    removeStudents,
};