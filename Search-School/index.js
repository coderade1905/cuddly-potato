module.exports =  (app, express, con, con1, crypto, bp, mysql, decrypt) => {
    app.route('/search-school').post((req, res) => {
        sname = req.body.search;
        arr = [];
        const query1 = `SELECT school_name, email FROM login WHERE email LIKE  CONCAT('%',?,'%')`
                con.query(query1, sname, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    for (let i = 0; i < data.length; i++)
                    {
                        arr.push({school_name : data[i].school_name, school_email : data[i].email});
                    }
                    res.json(arr);
                });
    
});
app.route('/school-req').post((req, res) => {
    if (req.body.e == "y")
    {
        try {
            email = decrypt(req.body.email);
        } catch (error) {
            return res.json({red: '/login', status : 400});
        } 
    }
    else{
        email = req.body.email;
    }
    const query1 = `SELECT Id FROM login WHERE email = ?`
            con.query(query1, email, (err, data) => {
                if (err) {
                    throw err;
                }
                if (data.length > 0)
                {
                const query2 = `SELECT * FROM schema${data[0].Id} WHERE t="s"`
                con1.query(query2, (err, data1) => {
                    if(err) {           
                    throw err;
                    }
                    res.json({data : data1, id : data[0].Id});
                })
                }
            });

});
}