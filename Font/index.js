module.exports =  (app, express) => {
    app.use("/Font", express.static(__dirname));
}