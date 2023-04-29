module.exports =  (app, express, con, con1, bp, nodeMailer, crypto) => {
    const axios = require('axios');
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken); 
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'kaleabbelayhun01@gmail.com',
            pass: process.env.EMAIL_PASS
        }
    });
    function randomString(length, chars) {
        if (!chars) {
          throw new Error('Argument \'chars\' is undefined');
        }
      
        const charsLength = chars.length;
        if (charsLength > 256) {
          throw new Error('Argument \'chars\' should not have more than 256 characters'
            + ', otherwise unpredictability will be broken');
        }
      
        const randomBytes = crypto.randomBytes(length);
        let result = new Array(length);
      
        let cursor = 0;
        for (let i = 0; i < length; i++) {
          cursor += randomBytes[i];
          result[i] = chars[cursor % charsLength];
        }
      
        return result.join('');
      }
      function randomAsciiString(length) {
        return randomString(length,
          '0123456789');
      }
    app.post('/send-email', function (req, res) {
        const Email = req.body.to;
        const Sname = req.body.Sname;
        const City = req.body.City;
        const PA1 = req.body.Pass;
        const PA2 = req.body.CPass;
        const PA = crypto.createHash('md5').update(PA1).digest('hex');
        if (!Sname|| !City || !PA1 || !PA2|| !Email) {
            res.json({error : 'Please Fill All The Fields.', status : 400});
        }
        else{
            if (PA1 == PA2)
            {
                let to = req.body.to;
                let gcode = randomAsciiString(8);
                let mailOptions = {
                    from: '"Skul" kingkalo19055@gmail.com', 
                    to: to, 
                    subject: 'Please Verify Your Email Address.', 
                    html: `your sign-in code is <b>${gcode}</b>`
                };
        
                transporter.sendMail(mailOptions, (error, data) => {
                    if (error) {
                        return console.log(error);
                    }
                    res.json({message : `We sent 8 digit code to ${to}`,message1 : `Note : this code is only valid for 10 minutes.`, status : 200})
                    let query = "INSERT INTO email_verfc (email, otp) VALUES (?, ?)";
                    con.query(query, [to, gcode], (err, data) => {
                        if (err) throw err;
                    });
                    });
            }
            else
            {
                res.json({error : "Passwords does not match.", status : 401});
            }
        }
        });
        app.post('/send-sms', (req, res) => {
            const spn = req.body.PN;
            console.log(spn);
            let session_url = 'https://lookups.twilio.com/v1/PhoneNumbers/';
            let username = accountSid; let password = authToken;
            let credentials = Buffer.from(username + ':' + password).toString('base64');
            let basicAuth = 'Basic ' + credentials;
            axios.get(session_url+spn, {headers: { 'Authorization': basicAuth } }).then((data) => {
                console.log(data.data);
                let otp = randomAsciiString(8);
                client.messages.create({ 
                    body: `Your skul code is: ${otp}`, 
                    from: '+19716065202',       
                    to: spn
                    }).done();
                    res.json({message : `We sent 8 digit code to ${spn}`,message1 : `Note : this code is only valid for 10 minutes.`, status : 200})
                            let query = "INSERT INTO sms_verc (phoneNumber, otp) VALUES (?, ?)";
                            con.query(query, [spn, otp], (err, data) => {
                                if (err) throw err;
                            });
            }).catch((error) => {
                let otp = randomAsciiString(8);
                    res.json({message : `We sent 8 digit code to ${spn}`,message1 : `Note : this code is only valid for 10 minutes.`, status : 200})
                            let query = "INSERT INTO sms_verc (phoneNumber, otp) VALUES (?, ?)";
                            con.query(query, [spn, otp], (err, data) => {
                                if (err) throw err;
                            });
                //res.json({status : 400, message : "Please check your phone number"});
              });

            });

}
