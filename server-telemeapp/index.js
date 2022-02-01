const PORT = process.env.PORT || 4000

const io = require('socket.io')(PORT, {
    cors: {
        origin: '*'
    }
});

let dados = '0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00000000,0.00000000,0.00'

//String(current_mppt) + "," + String(current_alimentation) + "," + String(voltage_batteries) + "," + String(current_motor) + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation) + "," + gps;

let vetorDados = []
let temposVoltas = []
let vetorGps = []
let voltasTotais = 5
let distanciaTotal = 0
let voltaAtual = 0
let bandeiras = []
let tempo = 0
let statusTempo = false


function resetarTempo(){
    tempo = 0;
}

function saveDataVector(data){
    if(vetorDados.length > 20000){
        vetorDados.shift()
    }
    vetorDados.push(data)
}

setInterval(function(){ 
    if(statusTempo){
        tempo += 1
        io.emit("tempo", tempo)
    }
}, 1000);


io.on("connection", socket => {
    console.log("USUARIO: " + socket.id);

    socket.emit("allinfo", vetorDados); // emite apenas para quem se conectou no momento
    socket.emit("voltaAtual", voltaAtual);
    socket.emit("voltasTotais", voltasTotais);
    socket.emit("bandeiras", bandeiras);
    socket.emit("tempo", tempo);
    socket.emit("statusTempo", statusTempo);
    socket.emit("temposVoltas", temposVoltas);
    socket.emit("distanciaTotal", distanciaTotal)
    socket.emit("gps", vetorGps)
    // console.log(vetorDados)

    socket.on("newinfo", (data) => {
        // console.log(data);
        let date_ob = new Date()
        let time = date_ob.toLocaleString('en-GB',  { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute:'2-digit', second:'2-digit'})

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
            speed: arrayDados[9],
            time: time
        }
        // console.log(dados);
        
        saveDataVector(dados)
        io.emit("info", dados); // emite para todos
    })


    socket.on("updateVoltaAtual", (volta) => {
        voltaAtual = volta
        io.emit("voltaAtual", voltaAtual)
    })

    socket.on("updateVoltasTotais", (volta) => {
        voltasTotais = volta
        io.emit("voltasTotais", voltasTotais)
    })

    socket.on("updateDistanciaTotal", (distancia) => {
        distanciaTotal = distancia
        io.emit("distanciaTotal", distanciaTotal)
        // console.log(distanciaTotal)
    })

    socket.on("updateBandeiras", (bandeirasArray) => {
        bandeiras = bandeirasArray
        io.emit("bandeiras", bandeiras)
    })

    socket.on("iniciarTempo", () => {
        statusTempo = true
        io.emit("statusTempo", statusTempo)
    })

    socket.on("pausarTempo", () => {
        statusTempo = false
        io.emit("statusTempo", statusTempo)
    })

    socket.on("pararTempo", () => {
        tempo = 0
        statusTempo = false
        io.emit("tempo", tempo)
        io.emit("statusTempo", statusTempo)
    })

    socket.on("adicionarTempoVolta", (tempo) => {
        temposVoltas.push(tempo)
        io.emit("temposVoltas", temposVoltas)
    })

    socket.on("removerTempoVolta", () => {
        temposVoltas.pop()
        io.emit("temposVoltas", temposVoltas)
    })
    
    socket.on("resetarTemposVoltas", () => {
        temposVoltas = []
        io.emit("temposVoltas", temposVoltas)
    })

    socket.on("updateGps", (gps) => {
        // vetorGps.push(gps)
        // add the current time in Brazil formated in HH:MM:SS
        let date_ob = new Date()
        let time = date_ob.toLocaleString('en-GB',  { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute:'2-digit', second:'2-digit'})
        let gpsAtual = {
            ...gps,
            time: time
        }
        // console.log(gpsAtual)
        io.emit("gpsAtual", gpsAtual)
    })

    socket.on("resetarGps", () => {
        vetorGps = []
        io.emit("gpsAtual", vetorGps)
    })

    socket.on("resetarTudo", () => {
        vetorDados = []
        temposVoltas = []
        vetorGps = []
        voltasTotais = 5
        distanciaTotal = 0
        voltaAtual = 0
        bandeiras = []
        tempo = 0
        statusTempo = false
        io.emit("allinfo", vetorDados); // emite apenas para quem se conectou no momento
        io.emit("voltaAtual", voltaAtual);
        io.emit("voltasTotais", voltasTotais);
        io.emit("bandeiras", bandeiras);
        io.emit("tempo", tempo);
        io.emit("statusTempo", statusTempo);
        io.emit("temposVoltas", temposVoltas);
        io.emit("distanciaTotal", distanciaTotal)
        io.emit("gps", vetorGps)
    })

})

