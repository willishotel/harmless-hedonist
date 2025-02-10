const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', //Replace with your MySQL user
    password: 'password', // Replace with your MySQL password
    database: 'user_auth' // Ensure this database exists
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    if (!firstName || !lastName || !email || !username || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const checkUserQuery = `SELECT email, username FROM users WHERE email = ? OR username = ?`;
        db.query(checkUserQuery, [email, username], async (err, results) => {
            if (err) {
                console.error('Error checking user:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (results.length > 0) {
                const existingUser = results[0];
                if (existingUser.email === email) {
                    return res.status(400).json({ success: false, message: 'Email already exists' });
                }
                if (existingUser.username === username) {
                    return res.status(400).json({ success: false, message: 'Username already exists' });
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertUserQuery = `INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)`;
            db.query(insertUserQuery, [firstName, lastName, email, username, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                console.log('✅ User registered:', { id: result.insertId, username });
                res.json({ success: true, message: 'User registered successfully' });
            });
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Error fetching from database:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            console.log('❌ User not found:', username);
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = results[0];
        try {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                console.log('✅ User logged in:', username);
                res.json({ success: true, message: 'Login successful' });
            } else {
                console.log('❌ Invalid password for:', username);
                res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        } catch (err) {
            console.error('Error comparing passwords:', err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    });
});

const PORT = 8000; 

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

