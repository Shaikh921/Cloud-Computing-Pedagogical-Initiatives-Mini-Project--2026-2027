import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "User already exists with this email address. Please log in instead." });
        }

        const hashed = await bcrypt.hash(password, 10);
        // Force role to 'user' for public registration to prevent privilege escalation
        const user = await User.create({
            name: name?.trim() || "",
            email: email.trim().toLowerCase(),
            password: hashed,
            skills: [],
            role: 'user'
        });

        // Fire inngest event gracefully
        try {
            await inngest.send({
                name: "user/signup",
                data: {
                    email: user.email,
                }
            });
        } catch (inngestErr) {
            console.warn("Inngest event dispatch skipped or dev server offline:", inngestErr.message);
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const userSafe = user.toObject();
        delete userSafe.password;

        res.status(201).json({ user: userSafe, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            // Unified message prevents user enumeration attacks
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const userSafe = user.toObject();
        delete userSafe.password;

        res.json({ user: userSafe, token });
    } catch (err) {
        res.status(500).json({ error: "Signin failed", details: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        return res.json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: "Logout failed", details: err.message });
    }
};

export const updateUser = async (req, res) => {
    const { skills, role, email } = req.body;
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Only admin can update user" });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found !" });

        const updateData = {};
        if (Array.isArray(skills)) {
            updateData.skills = skills;
        }
        if (role && ['user', 'moderator', 'admin'].includes(role)) {
            updateData.role = role;
        }

        await User.updateOne({ email }, updateData);
        return res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Update failed", details: err.message });
    }
};

export const getUser = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Only admin can get user" });
        }

        const users = await User.find().select('-password');
        return res.json({ users });
    } catch (err) {
        res.status(500).json({ error: "Get users failed", details: err.message });
    }
};
