const _ = require('lodash');
const Path = require('path-parser') .default;
const { URL } = require('url');
const mongoose = require('mongoose');
const Survey = mongoose.model('surveys');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer= require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate'); 





module.exports= (app)=>{

    app.get('/api/surveys',requireLogin, async (req, res)=>{
        const surveys = await Survey.find({_user: req.user.id})
        // to exclude recipients list to be sent along with the list of surveys
            .select({recipients: false});
        res.send(surveys);
    });
    
    app.get('/api/surveys/:surveyId/:choice', (req, res)=>{
        res.send('Thanks for voting!!');
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');
        
        // const events = _.map(req.body, (event)=>{
        //     //    To extract the particular route from Url 
        //     const pathname= new URL(event.url).pathname;
        //     // :surveyId and :choice are variables
        //     // and p is the object that we can use to look at the path name and extract "surveyID" and "choice"
        //     // PathParser is to parse as an object so that we can later compare it with the "pathname"
        //     const match = p.test(pathname);
        //     if(match){
        //         return {email: event.email, surveyId: match.surveyId, choice: match.choice};
        //     }
        // });
        // // for removing undefined elements out of events array
        // const compactEvents = _.compact(events);
        // // deleting duplicate elements based on email and surveyId
        // const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
       
       
        // Refactored Code with lodash Chain function
         _.chain(req.body)
            .map((event)=>{
                //    To extract the particular route from Url 
                const pathname= new URL(event.url).pathname;
                // :surveyId and :choice are variables
                // and p is the object that we can use to look at the path name and extract "surveyID" and "choice"
                // PathParser is to parse as an object so that we can later compare it with the "pathname"
                const match = p.test(pathname);
                if(match){
                    return {email: event.email, surveyId: match.surveyId, choice: match.choice};
                }
            })
            // for removing undefined elements out of events array
            .compact()
            // deleting duplicate elements based on email and surveyId
            .uniqBy('email', 'surveyId')
            // Saving the specific user response data to database after response is processed in above steps
            .each(event=>{
                // first object in updateone- will help to find the particular survey with given id, email and responded property
                // Second object will help to modify that given recipients using '$' sign.
                Survey.updateOne( 
                {
                    _id: event.surveyId,
                    recipients: {
                        $elemMatch: {email: event.email, responded: false}
                    }  
                }, 
                {
                    // Below code is going to increment yes or no by 1. choice= 'yes || no'
                    $inc: { [event.choice] : 1 },
                    // $ in the below code is given for finding a particular recipient element
                    $set: {"recipients.$.responded": true},
                    lastResponded: new Date()
                }).exec();
            })
            .value();

        res.send({});
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) =>{
        const { title, subject, body, recipients } = req.body;

        const survey =  new Survey({
            title: title,
            subject:subject,
            body: body,
            // recipients: recipients.split(',').map(email=>{return{email: email.trim() }})
            // Refactored Code below
            recipients: recipients.split(',').map(email=>({email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        });
        try {
            const mailer = new Mailer(survey, surveyTemplate(survey));
            await mailer.send();
            await survey.save();
            req.user.credits -=1;
            const user = await req.user.save();

            res.send(user);
        } catch(err){
            res.status(422).send(err);
        }
    });
};

