import io from 'socket.io-client';

// const socket = io.connect('http://192.168.15.43:4000')
const socket = io.connect('https://server-telemeapp.herokuapp.com');

export default socket;