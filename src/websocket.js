const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
  io = socketio(server);

  io.on('connection', socket => {
    console.log('Client connected');

    const { latitude, longitude, services } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      services: parseStringAsArray(services),
    });

    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
};

exports.findConnections = (coordinates, services) => {
  return connections.filter(connection => {
    return calculateDistance(coordinates, connection.coordinates) < 10
      && connection.services.some(item => services.includes(item))
  })
}

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  })
}