
const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Create a new customer
router.post('/customers', (req, res) => {
    const { firstName, lastName, phone, email, address } = req.body;

    if (!firstName || !lastName || !phone || !email) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    const sql = `INSERT INTO customers (first_name, last_name, phone_number, email, address) VALUES (?, ?, ?, ?, ?)`;
    const params = [firstName, lastName, phone, email, address];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Get all customers with search and pagination
router.get('/customers', (req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const sql = `
        SELECT * FROM customers
        WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?
        LIMIT ? OFFSET ?
    `;
    const params = [`%${search}%`, `%${search}%`, `%${search}%`, parseInt(limit), parseInt(offset)];

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Get a customer by ID
router.get('/customers/:id', (req, res) => {
    const sql = `SELECT * FROM customers WHERE id = ?`;
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(row);
    });
});

// Update a customer by ID
router.put('/customers/:id', (req, res) => {
    const { firstName, lastName, phone, email, address } = req.body;
    const sql = `
        UPDATE customers
        SET first_name = ?, last_name = ?, phone_number = ?, email = ?, address = ?
        WHERE id = ?
    `;
    const params = [firstName, lastName, phone, email, address, req.params.id];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer updated' });
    });
});

// Delete a customer by ID
router.delete('/customers/:id', (req, res) => {
    const sql = `DELETE FROM customers WHERE id = ?`;
    const params = [req.params.id];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted' });
    });
});

module.exports = router;
