const passport = require('passport');
const keys = require('../config/keys');
const stripe = require("stripe")(keys.stripeSecretKey);
const requieLogin = require('../middlewares/requireLogin');

module.exports = (app) =>{
    app.post('/api/stripe', requieLogin, async (req, res)=> {
        // Create a charge object by requesting the Stripe
        const charge= await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: 'I need your money',
            source: req.body.id 
        });
        req.user.credits += 5;
        const user = await req.user.save();
        
        res.send(user);
    });
};

