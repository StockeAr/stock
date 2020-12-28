const express = require('express');

const app = express();

const PORT=process.env.PORT || 8080;
// Serve only the static files form the dist directory
// Replace the '/dist/<to_your_project_name>'
app.use(express.static(__dirname+'/dist/stockear'));


app.get('/*',function(req,res){
    // Replace the '/dist/<to_your_project_name>/index.html'
    res.sendFile(__dirname+'/dist/stockear/index.html');
});

// Start the app by listening on the default Heroku port
app.listen(PORT,()=>{
    console.log('Servidor en el puerto : '+PORT);
});