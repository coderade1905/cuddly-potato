module.exports =  (app, express, con, io, bp) => 
{
app.use("/chat/public", express.static(__dirname + "/public"));
app.route('/chat').get(
    (req, res) => {
        res.sendFile(__dirname + '/public/chat.html');
    }
);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('message', (message) => 
    {
        io.emit('bmessage', message);
    });
  });
}