var cron = require('node-cron');
var nodemailer = require('nodemailer');

var mailOptions = {
    from: 'whatscookinggoodlooking14@gmail.com',
    to: 'matthewsschneiders@gmail.com',
    subject:`'What's Cooking Good Looking Expiry Notification`,
    text:`
    Hello!

    There are items in your fridge which are going to expire sometime in the next week!
    Please visit your "What's Cooking Good Looking" account to find out what's expiring soon.
    
    Hope you have a great week!`
};

var transporter = nodemailer.createTransport (
    {
        service: 'gmail',
        auth:{
            user: 'whatscookinggoodlooking14@gmail.com',
            pass:'msci343g14wcgl'
        }
    }
);
// email trigger - trigger set to send an alert email on Monday 12:20pm at time of demo 
cron.schedule('01 20 12 * * Monday', () => {
    console.log('node email.js');
    transporter.sendMail(mailOptions, function(error,info){
        if(error) {
            console.log(error);
        } else {
            console.log('Email sent: '+ info.response);
        }
    });
  });


