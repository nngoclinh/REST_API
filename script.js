document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/api/v1/students';

    // Function to fetch and display students
    function fetchStudents() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                return response.json();
            })
            .then(students => {
                const studentsBody = document.getElementById('studentsBody');
                studentsBody.innerHTML = ''; // Clear previous content
    
                students.forEach(student => {
                    const dobFormatted = new Date(student.dob).toLocaleDateString('en-GB');
    
                    const row = `
                        <tr>
                            <td>${student.id}</td>
                            <td>${student.name}</td>
                            <td>${student.age}</td>
                            <td>${dobFormatted}</td>
                            <td>${student.email}</td>
                            <td>
                                <button onclick="deleteStudent(${student.id})">Delete</button>
                                <button onclick="editStudent(${student.id}, '${student.name}', ${student.age}, '${student.dob}', '${student.email}')">Edit</button>
                            </td>
                        </tr>
                    `;
                    studentsBody.innerHTML += row;
                });
            })
            .catch(error => console.error('Error fetching students:', error));
    }
    

    // Initial fetch on page load
    fetchStudents();

    // Function to add a new student
    document.getElementById('addForm').addEventListener('submit', function (event) {
        event.preventDefault();
    
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const dobInput = document.getElementById('dob');
        const dob = dobInput.value; // Date value in yyyy-mm-dd format from date picker
    
        // Format dob to dd/mm/yyyy
        const dobParts = dob.split('-');
        const formattedDob = `${dobParts[2]}/${dobParts[1]}/${dobParts[0]}`;
    
        const email = document.getElementById('email').value;
    
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, age, dob: formattedDob, email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add student');
            }
            return response.json();
        })
        .then(() => {
            fetchStudents(); // Refresh students list after adding
            document.getElementById('addForm').reset(); // Clear form fields
        })
        .catch(error => {
            if (error.message === 'Failed to add student') {
                window.alert('Failed to add student. Email already exists.');
            } else {
                console.error('Error adding student:', error);
            }
        });
    });
    

    // Function to delete a student
    window.deleteStudent = function (id) {
        if (confirm('Are you sure you want to delete this student?')) {
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            })
            .then(() => fetchStudents()) // Refresh students list after deleting
            .catch(error => console.error('Error deleting student:', error));
        }
    };

    // Function to pre-fill edit form
    window.editStudent = function (id, name, age, dob, email) {
        document.getElementById('name').value = name;
        document.getElementById('age').value = age;
        // Set date value in yyyy-mm-dd format (for date picker compatibility)
        document.getElementById('dob').value = dob;
        document.getElementById('email').value = email;

        // Change submit button to update mode
        const addButton = document.querySelector('#addForm button[type="submit"]');
        addButton.textContent = 'Update Student';
        addButton.onclick = function (event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const age = document.getElementById('age').value;
            const dobInput = document.getElementById('dob');
            const dob = dobInput.value; // Date value in yyyy-mm-dd format from date picker
            // Format dob to dd/mm/yyyy
            const dobParts = dob.split('-');
            const formattedDob = `${dobParts[2]}/${dobParts[1]}/${dobParts[0]}`;

            const email = document.getElementById('email').value;

            fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, age, dob: formattedDob, email })
            })
            .then(response => response.json())
            .then(() => {
                fetchStudents(); // Refresh students list after updating
                document.getElementById('addForm').reset(); // Clear form fields
                addButton.textContent = 'Add Student'; // Reset button text
                addButton.onclick = addStudent; // Reset button click event
            })
            .catch(error => console.error('Error updating student:', error));
        };
    };

    // Function to switch back to add mode
    const addStudents = (req, res) => {
        const { name, email, age, dob } = req.body;
    
        // Format dob to yyyy-mm-dd
        const dobParts = dob.split('/'); // Assuming dob is in dd/mm/yyyy format
        const formattedDob = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
    
        // Check if email exists
        pool.query(queries.checkEmailExists, [email], (error, results) => {
            if (error) {
                console.error('Error checking email existence:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            if (results.rows.length > 0) {
                return res.status(400).json({ error: 'Email already exists' });
            }
    
            // Add student to database
            pool.query(queries.addStudents, [name, email, age, formattedDob], (error, results) => {
                if (error) {
                    console.error('Error adding student:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                res.status(201).json({ message: 'Student added successfully' });
            });
        });
    };
    

    addStudent(); // Initial setup for add button
});
