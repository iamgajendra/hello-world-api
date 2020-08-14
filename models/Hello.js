const mongoose = require('mongoose');                 //mongoDB model created for storing 
                                                      //hello world in different language
const helloSchema = new mongoose.Schema({             //here two fields are created one for language
	language:{                                        //and one for the hello word in that language
		type:String,
		required:true
	},
	hello:{
		type:String,
		required:true
	}
})

module.exports = mongoose.model("Hello",helloSchema)  //exporting the model