const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(401).send({
			code: 401,
			data: {},
			message: "You must be logged in"
		})
	}

	const token = authorization.replace('Bearer ', "");
	jwt.verify(token, 'secret_key', async (err, payload) => {
		if (err) {
			return res.status(401).send({
				code: 401,
				data: {},
				message: "You must be logged in"
			})
		}

		const { userId } = payload;
		const user = await User.findById(userId)
		req.user = user
		next()
	});
}