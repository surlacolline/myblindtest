import './LoadEnv'; // Must be the first import
import app from './Server';
import logger from './shared/Logger';
import Message, { IMessage } from './entities/Message';

// Start the server
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => {
  logger.info('Express server started on port: ' + port);
});

const ent = require('ent');

// Chargement de socket.io
const io = require('socket.io').listen(server);
io.origins('*:*');

io.sockets.on('connection', function (socket: any, pseudo: any) {
  console.log("connexion d'un joueur");
  // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
  socket.on('nouveau_joueur', function (pseudoAndID: string) {
    const pseudoAndIDArray = pseudoAndID.split('/');

    pseudo = ent.encode(pseudoAndIDArray[0] ?? '');

    const idPlaylist = ent.encode(pseudoAndIDArray[1] ?? '');
    const idPartie = ent.encode(pseudoAndIDArray[2] ?? '');
    socket.pseudo = pseudo;
    socket.idPlaylist = idPlaylist;
    socket.idPartie = idPartie;
    console.log('connexion du joueur' + pseudo);

    socket.join(idPartie);
    socket.in(socket.idPartie).emit('nouveau_joueur', pseudo);

    socket.on('disconnect', () => {
      console.log('user disconnected :' + pseudo);
    });
  });

  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('message', function (message: IMessage) {
    console.log(message.message);
    const mymessage = new Message(message);

    // socket
    //   .to(socket.idPartie)
    //   .emit('message', { pseudo: socket.pseudo, message });

    socket.to(socket.idPartie).emit('message', mymessage);
  });

  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('reussite', function (dataJoueurs: any) {
    // message = ent.encode(message);
    // socket.broadcast.emit('reussite', { pseudo: socket.pseudo, message });
    const message = new Message();
    message.id = 0;
    message.isUserMessage = false;
    message.message = 'reussite de ' + pseudo;
    message.pseudo = pseudo;
    io.to(socket.idPartie).emit('reussite', dataJoueurs);
  });

  socket.on('nextSong', function (dataJoueurs: any) {
    // message = ent.encode(message);
    // socket.broadcast.emit('reussite', { pseudo: socket.pseudo, message });
    const message = new Message();
    message.id = 0;
    message.isUserMessage = false;
    message.message = pseudo + ' a changé de chanson';
    message.pseudo = pseudo;
    io.to(socket.idPartie).emit('nextSong', dataJoueurs);
  });

  socket.on('play', function (pseudo: string) {
    // message = ent.encode(message);
    // socket.broadcast.emit('reussite', { pseudo: socket.pseudo, message });
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
    // dataPlaylist = ent.encode(dataPlaylist);
    // socket.broadcast.emit('reussite', { pseudo: socket.pseudo, message });
    io.in(socket.idPartie).emit('dataPlaylist', {
      id: socket.idPlaylist,
      dataPlaylist,
    });
  });

  socket.on('dataJoueurs', function (dataJoueurs: any) {
    // dataPlaylist = ent.encode(dataPlaylist);
    // socket.broadcast.emit('reussite', { pseudo: socket.pseudo, message });
    io.in(socket.idPartie).emit('dataJoueurs', dataJoueurs);
  });
});
