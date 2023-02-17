const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
app.use(express.static('public'));

app.get('/', (req, res)=> {
    res.sendFile( __dirname + '/sighUp.html');

});

app.post("/", (req, res) => {
    var name = req.body.NameInput; 
    var email = req.body.emailInput; 
    res.write("<h1>Result</h1>");
    res.write(name);
    res.send();
});

app.listen(port, () => {
    console.log('example app listening on port ' + port );
});

