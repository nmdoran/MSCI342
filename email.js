var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport (
    {
        service: 'gmail',
        auth:{
            user: 'whatscookinggoodlooking14@gmail.com',
            pass:'msci343g14wcgl'
        }
    }
);

var mailOptions = {
    from: 'whatscookinggoodlooking14@gmail.com',
    to: 'palak04021999@gmail.com',
    subject:'Test',
    text:`Hope this works LMAO
            What's Cooking Good Looking? 
            This is what's expiring soon!`
};

transporter.sendMail(mailOptions, function(error,info){
    if(error) {
        console.log(error);
    } else {
        console.log('Email sent: '+ info.response);
    }
});