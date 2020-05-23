const express = require("express");
const router = express.Router()
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup',async (req, res) => {
	let user = new User(req.body)
	try {
		await user.save();
		
		const token = jwt.sign({ userId: user._id}, "secret_key");
		res.send({
			code: 201,
			message: "Request Completed successfully!",
			body: {},
			token
		})
	} catch (error) {
		res.status(400).send({
			code: 400,
			data: (error.name === 'MongoError' && error.code === 11000) ? 'Email already exists !' : error.message,
			body: {}
		});
	}
})

router.post('/signin',async (req, res) => {
	const {email ,password} = req.body;
	if(!email || !password){
		res.status(400).send({
			code: 400,
			data: "Please provide the email and pasword.",
			body: {}
		})
	}
	try {
		const user = await User.findOne({email})
		!user && res.status(400).send({
			code: 400,
			data: "Email not found",
			body: {}
		})
		await user.comparePassword(password);
		const token  = jwt.sign({userId:user},"secret_key");
		res.send({
			code:200,
			message: "Request Completed successfully loggedIn!",
			body: {},
			token
		})
	} catch (error) {
		res.status(400).send({
			code: 400,
			data: "Invalid password or email.",
			body: {}
		});
	}
})


module.exports = router;

