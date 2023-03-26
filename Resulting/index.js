module.exports =  (app, express, con, con1, crypto, bp, encrypt) => {
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
    app.use("/resulting/public", express.static(__dirname + "/public"));
    app.route('/resulting').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    }).post((req, res) => {

    });
    app.post('/struct', (req, res) => {
        let da = req.body.da;
        console.log(da);
        
        con1.query(`INSERT INTO results (${da[0].join(",")}) VALUES(${da[1].join(",")})`, (err, data) => {
            if (err) throw err;
            res.json({mes : "done"});
        });
    });
}