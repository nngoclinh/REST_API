const express = require('express')
const app = express();
const port = 3000;
const studentRoutes = require('./src/student/routes');

app.use(express.json());

app.get("/",(req,res)=>{ 
    res.send("Hello world!");
});

app.use('/api/v1/students',studentRoutes);

app.listen(port,()=> console.log(`app listen on port ${port}`));
