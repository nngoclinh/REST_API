const getStudents = "SELECT * FROM students";
const getStudentsById = "SELECT * FROM students WHERE id = $1 ";
const checkEmailExists = "SELECT * FROM students WHERE email = $1;";
const addStudents =
  "INSERT INTO students (name,email,age,dob) VALUES ($1,$2,$3,$4)";
const removeStudents = "DELETE FROM students WHERE id = $1";
const updateStudents = 'UPDATE students SET name = $1, age = $2, dob = $3, email = $4 WHERE id = $5';
module.exports = {
  getStudents,
  getStudentsById,
  checkEmailExists,
  addStudents,
  removeStudents,
  updateStudents,
};