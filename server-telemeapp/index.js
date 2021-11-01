const io = require('socket.io')(4000, {
    cors: {
        origin: '*'
    }
});

let dados = '20.000,10.000'

//String(current_mppt) + "," + String(current_alimentation) + "," + String(voltage_batteries) + "," + String(current_motor) + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation) + "," + gps;


let vetorDados = []


function saveDataVector(data){
    if(vetorDados.length > 20000){
        vetorDados.shift()
    }
    vetorDados.push(data)
    // console.log("entrou aqui")
}


io.on("connection", socket => {
    console.log("USUARIO: " + socket.id);

    socket.emit("info", vetorDados); // emite apenas para quem se conectou no momento

    socket.on("newinfo", (data) => {
        // console.log(data);
        let arrayDados = data.split(',');
        dados = {
            current_mppt: arrayDados[0],
            current_alimentation: arrayDados[1],
            voltage_batteries: arrayDados[2],
            current_motor: arrayDados[3],
            temperature: arrayDados[4],
            humidity: arrayDados[5],
            voltage_alimentation: arrayDados[6],
            lat: arrayDados[7],
            long: arrayDados[8],
            speed: arrayDados[9]
        }
        console.log(dados);
        
        saveDataVector(dados)
        io.emit("info", dados); // emite para todos
    })
})