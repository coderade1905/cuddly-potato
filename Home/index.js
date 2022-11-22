module.exports =  (app, express, con, crypto, bp, encrypt) => {
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
    app.use("/home/public", express.static(__dirname + "/public"));
    app.route('/home').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    }).post((req, res) => {
        
});
}