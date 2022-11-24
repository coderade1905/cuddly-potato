module.exports = (app, express, con, con1, crypto, bp, decrypt) => {
    app.use(bp.json());
    app.use("/school-home/public", express.static(__dirname + "/public"));
    app.use(bp.urlencoded({ extended: true }));
    app.route('/school-home').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
        }).post();
    app.route('/get-started').get((req, res) => {
        res.sendFile(__dirname + '/public/get-started.html');
        }).post((req, res) => {
            let pn;
            let pass;
            let type = req.body.type;
            let ac = "";
            let st = "";
            let sc = "";
            if (req.body.pn != "" && req.body.pass != "" && type != "")
            {
                if (type == "s"){
                    ac = "astudents";
                    st = "students";
                }
                else if (type == "t")
                {
                    ac = "ateachers";
                    st = "teachers";
                }
                try{
                    pn = decrypt(req.body.pn);
                    pass = decrypt(req.body.pass);
                }
                catch(error){
                    res.json({red : 'http://localhost:3030/school-login', status : 401});
                }
                let options = "";
                let options1 = "";
                let array = req.body.otherChoices;
                let clean1 = ['radio', 'select']
                let clean = ['text', 'number', 'file', 'email', 'image', 'password']
                const reference = {number : "int", text : "varchar", email : "email", image : "varchar", password : "varchar", radio : "varchar", select : "varchar", email : "varchar", }
                let query = "SELECT id FROM login WHERE email = ? AND password = ?";
                console.log(array);
                con.query(query, [pn, pass] ,(err, data) => {
                    if (err) {
                        throw err;
                    }
                    if(data.length > 0)
                    {
                        var id = data[0].id;
                        con1.query(`SELECT * FROM schema${id} WHERE t = 's'`, (err, data) => {
                            if (err) {
                                throw err
                            }
                            if (data.length > 0)
                            {
                                con1.query(`DROP TABLE students${id}`, (err, data) => {
                                    if (err) {throw err}
                                });
                                con1.query(`DELETE FROM schema${id} WHERE t = 's'`, (err, data) => {
                                    if (err) {throw err}
                                });
                            }
                            array.forEach(element => {
                                options1 = "";
                                if (element.ind == 1)
                                {
                                    if (clean1.includes(element["2"]))
                                    {
                                        if (element["1"] !== "" && element["1"] !== undefined  && element["2"] !== "" && element["2"] !== undefined && element["3"] !== "" && element["3"] !== undefined)
                                        {
                                            let fieldName = element["1"];
                                            let fieldType = element["2"];
                                            let values = element["3"];
                                            let max = 0;
                                            values.forEach(element => {
                                                if (values.indexOf(element) == 0)
                                                {
                                                    options1 += `${element}`
                                                }
                                                else{
                                                    options1 += `,${element}`
                                                }
                                                if (element.length > max) 
                                                {
                                                    max = element.length;
                                                }
                                            });
                                            options += `, ${fieldName.replace(" ", "_")} ${reference[fieldType]}(${max}) NOT NULL`;
                                            con1.query(`INSERT INTO schema${id} (Field_Name ,Field_Type, Length, Is_option, options, t) VALUES (?, ?, ?, ?, ?, ?)`, [fieldName, fieldType, max, '1' ,options1, 's'], (err, data) => {
                                                if (err) throw err;
                                            });
                                        }
                                    }
                                } 
                                else if (element.ind == 0)
                                {
                                    if (clean.includes(element["2"]))
                                    {
                                        if (element["1"] !== "" && element["1"] !== undefined  && element["2"] !== "" && element["2"] !== undefined && element["3"] !== "" && element["3"] !== undefined)
                                        {
                                            let fieldName = element["1"];
                                            let fieldType = element["2"];
                                            let length = element["3"];
                                            if (!Number.isInteger(length)) {
                                                res.json({message : "Length must be integer!",status : 400})
                                            }
                                            options += `, ${fieldName.replace(" ", "_")} ${reference[fieldType]}(${length}) NOT NULL`;
                                            con1.query(`INSERT INTO schema${id} (Field_Name ,Field_Type, Length, Is_option, options, t) VALUES (?, ?, ?, ?, ?, ?)`, [fieldName, fieldType, length, '0' , 'NOTANOPTION', 's'],(err, data) => {
                                                if (err) throw err;
                                            });
                                        }
                                    }
                                }
                            });
                            options = options.replace("?", "");
                            con1.query(`CREATE TABLE students${id} (Student_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,Fullname varchar(40) NOT NULL, Password varchar(100) NOT NULL, PhoneNumber varchar(100) NOT NULL ${options}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`, (err, data) => {
                                if (err) throw err;
                            });
                        });
                    }
                    else{
                        res.json({red : '/school-login', status : 401});
                    }       
                });
            }
        }
        );
}