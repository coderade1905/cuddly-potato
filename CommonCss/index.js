module.exports = (app, express) => {
    app.use("/commoncss/public", express.static(__dirname + "/public"));
};