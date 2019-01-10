const express = require ('express');
const app = express();


app.get('/', (req, res) => {
    res.send({bye: 'nalayak'});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log('Server is running now....');
});