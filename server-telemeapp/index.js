const PORT = process.env.PORT || 4000

const io = require('socket.io')(PORT, {
    cors: {
        origin: '*'
    }
});

let dados = '0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00000000,0.00000000,0.00'

//String(current_mppt) + "," + String(current_alimentation) + "," + String(voltage_batteries) + "," + String(current_motor) + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation) + "," + gps;


let vetorDados = []


function saveDataVector(data){
    if(vetorDados.length > 20000){
        vetorDados.shift()
    }
    vetorDados.push(data)
}


io.on("connection", socket => {
    console.log("USUARIO: " + socket.id);

    socket.emit("allinfo", vetorDados); // emite apenas para quem se conectou no momento
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
})