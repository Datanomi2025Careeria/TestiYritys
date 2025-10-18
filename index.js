const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Palauttaa henkilökuntatiedot JSON-muodossa
app.get('/henkilokunta', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'henkilokunta.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Virhe tiedoston lukemisessa');
    res.json(JSON.parse(data));
  });
});

// Socket.io yhteyden käsittely
io.on('connection', (socket) => {
  //console.log('Uusi käyttäjä yhdistetty');

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg); // Lähetetään viesti kaikille
  });

  socket.on('disconnect', () => {
   // console.log('Käyttäjä poistui');
  });
});

// Käynnistää palvelimen
//const PORT = 3000;
const PORT = "https://testiyritys.onrender.com";
server.listen(PORT, () => {
  console.log(`Palvelin käynnissä at http://localhost:${PORT}/?#`);
});