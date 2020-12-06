import Message, { IMessage } from './entities/Message';
import './LoadEnv'; // Must be the first import
import app from './Server';
import logger from './shared/Logger';

// Start the server
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => {
  logger.info('Express server started on port: ' + port);
});

const ent = require('ent');

// Chargement de socket.io
const io = require('socket.io').listen(server);
io.origins('*:*');
const allPlayers: any[] = [];

io.sockets.on('connection', function (socket: any) {

  // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
  socket.on('nouveau_joueur', function (data: { pseudo: string, idPlayer: number, idCurrentPlaylist: string, idCurrentGame: string }) {
    socket.idPlayer = data.idPlayer;
    socket.pseudo = data.pseudo;
    socket.idPlaylist = data.idCurrentPlaylist;
    socket.idPartie = data.idCurrentGame;
    allPlayers.push(socket);

    socket.join(socket.idPartie);
    socket.in(socket.idPartie).emit('nouveau_joueur', socket.pseudo);
  });

  socket.on('disconnect', (event: any) => {
    const i = allPlayers.indexOf(socket);
    allPlayers.splice(i, 1);
    io.in(socket.idPartie).emit('user_leave', socket.pseudo);

  });

  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('message', function (message: IMessage) {
    console.log(message.message);
    const mymessage = new Message(message);

    socket.to(socket.idPartie).emit('message', mymessage);
  });

  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('reussite', function (dataJoueurs: any) {
    io.to(socket.idPartie).emit('reussite', dataJoueurs);
  });

  socket.on('nextSong', function (dataJoueurs: any) {
    io.to(socket.idPartie).emit('nextSong', dataJoueurs);
  });

  socket.on('play', function (pseudo: string) {
    io.to(socket.idPartie).emit('play', pseudo);
  });

  socket.on('start', function (pseudo: string) {
    const mymessage = new Message();
    mymessage.pseudo = pseudo;
    mymessage.message = pseudo + ' lance la partie';
    mymessage.id = 0;
    mymessage.isUserMessage = false;
    socket.to(socket.idPartie).emit('start', mymessage);
  });

  socket.on('dataPlaylist', function (dataPlaylist: any) {
    io.in(socket.idPartie).emit('dataPlaylist', {
      id: socket.idPlaylist,
      dataPlaylist,
    });
  });

  socket.on('dataJoueurs', function (dataJoueurs: any) {
    io.in(socket.idPartie).emit('dataJoueurs', dataJoueurs);
  });
});
