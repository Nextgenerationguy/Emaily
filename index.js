const express = require ('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
require('./models/User');
require('./models/Survey');
require('./services/passport');
const authRoutes = require('./Routes/authRoutes');
const billingRoutes = require('./Routes/billingRoutes');
const surveyRoutes = require('./Routes/surveyRoutes');
const keys = require('./config/keys');




mongoose.connect(keys.mongoURI, {useNewUrlParser: true});

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use(
    cookieSession({
        // 30 days in milli seconds
        maxAge: 30*24*60*60*1000,
        keys: [keys.cookieKey]
    })
);


app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);
billingRoutes(app);
surveyRoutes(app);

if (process.env.NODE_ENV === 'production'){
    // Express will serve production assets like main.js or main.css
    app.use(express.static('client/build'));
    // Express will serve up the Index.html if it doesn't recognize the given route
    const path = require('path');
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log('Server is running now....');
});