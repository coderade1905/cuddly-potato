module.exports =  (app, express, con, con1, crypto, bp) => {
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
    app.use("/register/public", express.static(__dirname + "/public"));
    app.get('/register', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    })
    app.post('/verify-sms-otp', (req, res) => {
        let otp = req.body.otp;
        let phone = req.body.phone;
        let fn = req.body.FN;
        let pass = req.body.Pass;
        let cpass = req.body.CPass;
        let PA = crypto.createHash('md5').update(pass).digest('hex');
        let id = req.body.id;
        let values = req.body.values;
        let fields = req.body.fields;
        let rfields = [];
        fields.forEach(field => {
            rfields.push(field.Name.replace(" ", "_"));
        });
        if (rfields.length == values.length)
        {
            if (pass == cpass)
            {
                let query = "SELECT * FROM sms_verc WHERE phoneNumber = ? AND otp = ? ORDER BY Id DESC";
                con.query(query, [phone, otp], (err, data) => {
                    if (err) throw err;
                    if (data.length > 0)
                    {
                        const generatedAt1 = new Date(data[0].date);
                        const currentDate1 = new Date();
                        const diffTime1 = Math.abs(currentDate1 - generatedAt1);
                        if (diffTime1 < 600000)
                        {
                            con1.query(`SELECT * FROM students${id} WHERE PhoneNumber = ?`, phone, (err, data) => {
                                if (err) throw err;
                                if (data.length > 0)
                                {
                                    res.json({status : 400, message : "Phonenumber already exists."})
                                }
                                else {
                                    con1.query(`INSERT INTO students${id} (Fullname, PhoneNumber, Password, ??) VALUES (?, ?, ?, ?)`,[rfields, fn, phone, PA, values],(err, data) => 
                                    {
                                        if (err) throw err;
                                        res.json({status : 200, red : "/login"});
                                    });
                                }
                            })
                        }
                        else {
                            res.json({status : 400, message : "Your otp is expired!"});
                        }
                    }
                    else{
                        res.json({status : 400, message : "Incorrect otp"});
                    }
                }) 
            }
            else {
                res.json({status : 400, message : "Passwords doesn't match"});
            }
        }
        else
        {
            res.json({status : 400, message : "Please fill al the fields"});
        }
    })
}