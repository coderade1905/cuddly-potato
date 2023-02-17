module.exports = (app, express, con, con1, crypto, bp, decrypt) =>
{
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
    function student(req, res)
    {
        if (req.body.pn != "" && req.body.pass != "")
        {
            let pn = "";
            let pass = "";
            let sid = req.body.sid;
            try {
                pn = decrypt(req.body.pn);
                pass = decrypt(req.body.pass);
            } catch (error) {
                return res.json({red: '/login', status : 400});
            }
            query = `SELECT * FROM students${sid} WHERE PhoneNumber = ? AND Password = ?`;
            con1.query(query, [pn, pass] ,(err, data) => {
                if (err) {
                    throw err;
                }
                if(data.length > 0)
                {
                    return res.json({PN : data[0].PhoneNumber, FN : data[0].FullName, Pass : data[0].Password, Cyear : new Date().getFullYear(), status : 200});
                }
                else{
                    return res.json({red: '/login', status : 400});
                }        
            });
    }
    else 
        {
            return res.json({red: '/login', status : 400});
        }
    }
    function school(req, res)
    {
        if (req.body.email !== "" && req.body.pass !== "")
            {
                let email = ""
                let pass = ""
            try {
                email = decrypt(req.body.email);
                pass = decrypt(req.body.pass);
            } catch (error) {
                return res.json({red: '/school-login', status : 400});
            }
            query = "SELECT * FROM login WHERE email = ? AND password = ?"
            con.query(query, [email, pass] ,(err, data) => {
                if (err) {
                    throw err;
                }
                
                if(data.length > 0)
                {
                    return res.json({SN : data[0].school_name,City : data[0].City, status : 200});
                }
                else{
                    return res.json({red: '/school-login', status : 400});
                }        
            });
        }
        else 
        {
            return res.json({red : '/school-login', status : 400});
        }
    }
    app.post('/cookie-validate', (req, res) => {
        if (req.body.type == "student")
        {
            student(req, res);
        }
        if (req.body.type == "school")
        {
            school(req, res);
        }
    });

    app.use("/cookie-validate", express.static(__dirname));
}