const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const PythonShell = require('python-shell').PythonShell;

const app = express();

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

	
// For Multer Storage
var multerStorage = multer.diskStorage({
    destination: function (req, file, callback) {
    callback(null, path.join(__dirname));
    },
    filename: function (req, file, callback) {
    callback(null, "input.csv");
    }
});

// For Single File upload
var multerSigleUpload = multer({ storage: multerStorage });

// Base index route
app.get('/', function(req, res) {
    const uploadStatus = req.app.locals.uploadStatus;
    req.app.locals.uploadStatus = null;
    //console.log("Uploaded in ", path.join(__dirname,'images'))
    res.render('file_upload', {
        uploadStatus : uploadStatus
    });
});

//route for single file upload
app.post("/singleFile", multerSigleUpload.single('singleImage'), function(req, res) {
    const file = req.file
    if (!file) {
        return res.end("Please choose file to upload!");
    }
    req.app.locals.uploadStatus = true;


    let options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: ''
      };
      
      PythonShell.run('hello.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
      });

    
    //setTimeout(, 3000);
    res.redirect('/')
});


//route to download a file
app.get('/download',(req, res) => {
    //var file = req.params.file;
    var fileLocation = path.join(__dirname,'test.csv');
    console.log(fileLocation);
    res.download(fileLocation,'test.csv');
    });

    //localhost:3000/download


    

app.get('/runFile',(req, res) => {
    
let options = {
    mode: 'text',
    pythonPath: '',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: ''
  };
  
  PythonShell.run('hello.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
  });
    
});



// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});