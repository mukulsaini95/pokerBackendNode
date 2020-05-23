const mongoose = require('mongoose');
const keys = require('./src/config/keys');


mongoose.connect(keys.mongoURI,  { useNewUrlParser: true,
	useNewUrlParser: true,
	useCreateIndex: true
 })

mongoose.connection.on('connected',()=>{
	console.log('connected: ');

})

mongoose.connect('error',(error)=>{
	console.log('error: ', error);
})
