const io = require('socket.io')(4000, {
    cors: {
        origin: '*'
    }
});

let dados = ''

io.on("connection", socket => {
    console.log("USUARIO: " + socket.id);

    socket.emit("info", dados); // emite apenas para quem se conectou no momento

    socket.on("newinfo", (data) => {
        console.log(data);
        dados = data;
        io.emit("info", data); // emite para todos
    })
})