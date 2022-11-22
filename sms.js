require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken); 
 
client.messages 
      .create({ 
         body: 'i work', 
         from: '+19716065202',       
         to: '+251941911124' 
       }) 
      .then(message => console.log(message)) 
      .done();