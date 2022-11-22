module.exports =  (app, express, con, con1, crypto, bp, encrypt) => {
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
    app.use("/login/public", express.static(__dirname + "/public"));
    app.route('/login').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    }).post((req, res) => {
    const PN = req.body.PhoneNumber;
    const PA1 = req.body.Pass;
    const EMAIL = req.body.Email;
    let schoolname = "";
    let id;
    const PA = crypto.createHash('md5').update(PA1).digest('hex');
    con.query("SELECT * FROM login WHERE email=?", EMAIL, (err, data) =>
    {
        if (err) throw err;
        if (data.length > 0)
        {
            id = data[0].Id;
            console.log(id, PN, PA);
            schoolname = data[0].school_name;
            const query = `SELECT * FROM astudents${id} WHERE PhoneNumber=? AND Password=?`
            con1.query(query, [PN, PA] ,(err, data) => {
                if (err) {
                    throw err;
                }
                if(data.length == 1)
                {
                    res.json({PN : encrypt(data[0].PhoneNumber), User : encrypt(data[0].Fullname), FN : data[0].Fullname, SN : schoolname, Pass : encrypt(data[0].Password), Sid : id, red : "http://localhost:3030/home/", status : 200});
                }
                else{
                    res.json({message : 'Incorrect phone_number or password', status : 401});
                }        
            });
        }
        else
        {
            res.json({message : 'No such school email', status : 400});
        }
    })
});
}