const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// In-memory data storage
let users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25,
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// Helper function to find user by ID
const findUserById = (id) => {
  return users.find(user => user.id === parseInt(id));
};

// Helper function to validate user data
const validateUser = (user) => {
  const errors = [];
  
  if (!user.name || user.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!user.email || !user.email.includes('@')) {
    errors.push('Valid email is required');
  }
  
  if (!user.age || user.age < 0) {
    errors.push('Age must be a positive number');
  }
  
  return errors;
};

// Routes

// GET /users - List users with optional filters
app.get('/api/users', (req, res) => {
  try {
    let filteredUsers = [...users];
    
    // Search filter
    const search = req.query.search;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Sorting
    const sort = req.query.sort;
    const order = req.query.order || 'asc';
    
    if (sort) {
      filteredUsers.sort((a, b) => {
        let aVal = a[sort];
        let bVal = b[sort];
        
        // Handle string comparison
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (order === 'desc') {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
    }
    
    res.json({
      success: true,
      data: filteredUsers,
      count: filteredUsers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /users/:id - Get user details
app.get('/api/users/:id', (req, res) => {
  try {
    const user = findUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST /users - Create a new user
app.post('/api/users', (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    // Validate input
    const errors = validateUser({ name, email, age });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const newUser = {
      id: nextId++,
      name: name.trim(),
      email: email.trim(),
      age: parseInt(age),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT /users/:id - Update an existing user
app.put('/api/users/:id', (req, res) => {
  try {
    const user = findUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const { name, email, age } = req.body;
    
    // Validate input
    const errors = validateUser({ name, email, age });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    // Check if email already exists (excluding current user)
    const existingUser = users.find(u => u.email === email && u.id !== user.id);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Update user
    user.name = name.trim();
    user.email = email.trim();
    user.age = parseInt(age);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// DELETE /users/:id - Delete a user
app.delete('/api/users/:id', (req, res) => {
  try {
    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'User Management API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log('Available endpoints:');
  console.log('  GET    /api/users');
  console.log('  GET    /api/users/:id');
  console.log('  POST   /api/users');
  console.log('  PUT    /api/users/:id');
  console.log('  DELETE /api/users/:id');
  console.log('  GET    /api/health');
});

module.exports = app;