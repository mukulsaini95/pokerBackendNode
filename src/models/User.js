const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const User =  new mongoose.Schema({
	// name: {
	// 	type: String,
	// 	required: true
	// },
	email: {
		type: String,
		trim: true,
		unique: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Enter the valid email!")
			}
		},
		default: ""
	},
	password: {
		type: String,
		required: true,
		minLength: 7,
		trim: true,
		validate(value) {
			if (value.toLowerCase().includes('password')) {
				throw new Error('password cannot contains "password"')
			}
		}
	},
	// age: {
	// 	type: Number,
	// 	// min:18,
	// 	// max:23,
	// 	default: 18,
	// 	validate(value) {
	// 		if (value < 0) {
	// 			throw new Error("Age must be greater than 0")
	// 		}
	// 	}
	// },
	// address: {
	// 	type: Object
	// }
})

User.pre('save', function (next) {
	const user = this;
	if (!user.isModified('password')) {
		return next()
	}
	// user.password = bcrypt.hashSync(user.password, 10)
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err)
		}
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) {
				return next(err)
			}
			console.log('user: ', user);
			user.password = hash;
			next();
		})
	})

})


User.methods.comparePassword = function(candidatePassword){
	const user = this;
	return new Promise((resolve,reject)=>{
		bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
			if (err) {
				return reject(err)
			}
			if (!isMatch) {
				return reject(err)
			}

			resolve(true)
		})
	})
}

// const me = new User({
// 	name: "Mukul Saini",
// 	// age: -23,
// 	address: {
// 		address1: "test"
// 	}
// })

// me.save().then((res) => {

// }).catch((err) => {
// 	console.log('err: ', err.message);

// })

module.exports = mongoose.model('user', User);
;