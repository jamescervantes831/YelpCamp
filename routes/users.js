const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.get('/register', (req, res) =>{
    res.render('users/register');
})

router.post('/register', (req, res) =>{
    res.send(req.body.user)
})

module.exports = router