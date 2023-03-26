module.exports =  (app, express, con, con1, crypto, bp) => {
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
    app.use("/register/public", express.static(__dirname + "/public"));
    app.get('/register', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    })
    app.get('/register-teacher', (req, res) => {
        res.sendFile(__dirname + '/public/register-teacher.html');
    })
    app.post('/verify-sms-otp', (req, res) => {
        let otp = req.body.otp;
        let phone = req.body.phone;
        let fn = req.body.FN;
        let pass = req.body.Pass;
        let cpass = req.body.CPass;
        let gender = req.body.Gender;
        let cla = req.body.Class;
        console.log(cla);
        let PA = crypto.createHash('md5').update(pass).digest('hex');
        let id = req.body.id;
        let values = req.body.values;
        let fields = req.body.fields;
        let ty = req.body.type;
        let st = "";
        let lg = "";
        if (ty == "s")
        {
            st = "students";
            lg = "/login";
        }
        else if (ty == "t"){
            st = "teachers";
            lg = "/login-teacher";
        }
        values.forEach(value => {
            value.split('?').join('');
        });
        fields.forEach(field => {
            field['Name'] = field['Name'].split('?').join('');
        });
        let rfields = [];
        console.log(typeof(fields));
        if (fields != undefined)
        {
            fields.forEach(field => {
                rfields.push(field.Name.split(" ").join("_"));
            });
        }
        else{
            rfields = [];
            fields = [];
            values = [];
        }
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
                            con1.query(`SELECT * FROM ${st+id} WHERE PhoneNumber = ?`, phone, (err, data) => {
                                if (err) throw err;
                                if (data.length > 0)
                                {
                                    res.json({status : 400, message : "Phonenumber already exists."})
                                }
                                else {
                                    if (rfields.length > 0)
                                    {
                                        con1.query(`INSERT INTO ${st+id} (Fullname, PhoneNumber, Password, ${st == "students" ? "Class," : ""} Gender, Status, School_id, ??) VALUES (?, ?, ?, ?, ${st == "students" ? "?," : ""} ?, ?, ?)`,[rfields, fn, phone, PA, gender, "W", id, values],(err, data) => 
                                            {
                                                if (err) throw err;
                                                res.json({status : 200, red : "/login"});
                                            });
                                    }
                                    else{
                                        con1.query(`INSERT INTO ${st+id} (Fullname, PhoneNumber, Password, ${st == "students" ? "Class," : ""} Gender, Status) VALUES (?, ?, ? ${st == "students" ? "?," : ""} ,?, ?)`,[fn, phone, PA, gender, "W"],(err, data) => 
                                            {
                                                if (err) throw err;
                                                res.json({status : 200, red : lg});
                                            });
                                    }
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