var cron = require('node-cron');
var nodemailer = require('nodemailer');
var fs = require("fs");
var ejs = require("ejs");

ejs.renderFile(__dirname + "/email.ejs", { name: 'Test' }, function (err, data) {
    if (err) {
        console.log(err);
    } else {
var mailOptions = {
    from: 'whatscookinggoodlooking14@gmail.com',
    to: 'palak04021999@gmail.com',
    subject:`'What's Cooking Good Looking Expiry Notification`,
    text:`
    Hello!

    There are items in your fridge which are going to expire sometime in the next week! Here's a glimpse of what's going bad.
    Please visit your "What's Cooking Good Looking" account to find interesting recipes so you can use them before they go bad!
    
    Hope you have a great week!`,
    html: data
};
console.log("html data ======================>", mainOptions.html);
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

});

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
cron.schedule('01 18 19 * * Sunday', () => {
    console.log('node email.js');
    transporter.sendMail(mailOptions, function(error,info){
        if(error) {
            console.log(error);
        } else {
            console.log('Email sent: '+ info.response);
        }
    });
  });


