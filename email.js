var cron = require('node-cron');
var nodemailer = require('nodemailer');

var mailOptions = {
    from: 'whatscookinggoodlooking14@gmail.com',
    to: 'palak04021999@gmail.com',
    subject:'Test',
    text:`Hope this works LMAO
            What's Cooking Good Looking? 
            This is what's expiring soon!`
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
// email trigger
cron.schedule('01 00 09 * * Sunday', () => {
    console.log('node email.js');
    transporter.sendMail(mailOptions, function(error,info){
        if(error) {
            console.log(error);
        } else {
            console.log('Email sent: '+ info.response);
        }
    });
  });


