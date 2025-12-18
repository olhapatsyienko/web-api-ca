import express from 'express';
import mongoose from 'mongoose';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create)/Authenticate User
router.post('/', asyncHandler(async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ success: false, msg: 'Username and password are required.' });
    }
    if (req.query.action === 'register') {
        return await registerUser(req, res);
    } else {
        return await authenticateUser(req, res);
    }
}));

async function registerUser(req, res) {
    // Password validation: at least 8 characters, one letter, one digit, and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({ 
            success: false, 
            msg: 'Password must be at least 8 characters long and contain at least one letter, one digit, and one special character (@$!%*#?&).' 
        });
    }
    
    if (mongoose.connection.readyState !== 1) {
        throw new Error('Database is not connected. Please check your MongoDB connection.');
    }
    
    try {
        await User.create(req.body);
        return res.status(201).json({ success: true, msg: 'User successfully created.' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                msg: 'Username already exists. Please choose a different username.' 
            });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                msg: error.message || 'Validation error occurred.' 
            });
        }
        throw error;
    }
}

async function authenticateUser(req, res) {
    const user = await User.findByUserName(req.body.username);
    if (!user) {
        return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        if (!process.env.SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        const token = jwt.sign({ username: user.username }, process.env.SECRET);
        return res.status(200).json({ success: true, token: 'BEARER ' + token });
    } else {
        return res.status(401).json({ success: false, msg: 'Wrong password.' });
    }
}

export default router;
