const io = require('socket.io')(4000, {
    cors: {
        origin: '*'
    }
});

let dados = '20.000,10.000'
let vetorDados = ['20.000,10.000','20.000,10.000','20.000,10.000']

io.on("connection", socket => {
    console.log("USUARIO: " + socket.id);

    socket.emit("info", vetorDados); // emite apenas para quem se conectou no momento

    socket.on("newinfo", (data) => {
        console.log(data);
        dados = data;
        io.emit("info", data); // emite para todos
    })
})