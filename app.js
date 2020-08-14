const express  = require('express');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors');
const PORT = process.env.PORT || 5000;             //port which the server listens to
const {MONGOURL} = require('./key')                //mogoDB URL key for connecting DB
const bodyParser = require('body-parser');         
const Hello = require('./models/Hello');           //importing Hello model which contains the hello world in
                                                   //different languages.



//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());



// GET THE HELLO WORLD IN SPECIFIED LANGUAGE
app.get('/hello',async (req,res) =>{
   
    //storing the language in response
    var response = {};
    response.language = req.query.language;                        
    
    //checking the language is supported(i.e. contain in DB)
    // if supported genrating the response of HELLO WORLD in 
    //that specific language.
    //else genrating the response of error_message
    await Hello.findOne({language: response.language})
        .then(lang => {
            if(!lang){
                res.status(400).json({"error_message" : "The requested language is not supported"})
            } else {
                res.status(200).json({"message":{"ID": lang._id,"msgText":lang.hello}});
            }
        })
        .catch(err => {
            console.log("Error is ", err.message);
        });
})




//ADD HELLO WORLD IN OTHER LANGUAGES
app.post('/hello', async (req,res) => {

    //storing the language and the hello world 
    //in hello.
    const hello = new Hello({
        language: req.body.language,
        hello: req.body.hello
    });

    //checking if the language is already present in
    //DB. if present then error_message response is generated
    //if not present then save hello in the DB. and generating the Response.
    await Hello.findOne({language: hello.language})
        .then(lang => {
            if(lang){
                res.status(400).json({"error_message" : "The requested language is already present"})
            } else {
                hello.save()
                .then(data => {
                    res.status(200).json(data);
                })
                .catch(err => {
                    res.json({message :err})
                })
            }
        })
        .catch(err => {
            console.log("Error is ", err.message);
        });
    
});




//CONNECTING MONGODB CLOUD
mongoose.connect(MONGOURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
	console.log('connected to mango database')
})
mongoose.connection.on('error',(err)=>{
	console.log('error connecting', err)
})





//LISTENING TO PORT 
app.listen(PORT,()=>{
	console.log(`server is running on ${PORT}`);
})