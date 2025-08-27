import io from 'socket.io';

const socket = io.connect('http://localhost:3000');

socket.on('newMessage', (message) => {
  console.log('New message:', message);
});

export default socket;