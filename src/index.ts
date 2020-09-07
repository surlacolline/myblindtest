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

    socket.join(idPartie);
    socket.in(socket.idPartie).emit('nouveau_joueur', pseudo);

    socket.on('disconnect', () => {
      console.log('user disconnected :' + pseudo);
    });
  });

  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('message', function (message: any) {
    message = ent.encode(message);
    console.log(message);

    // socket
    //   .to(socket.idPartie)
    //   .emit('message', { pseudo: socket.pseudo, message });

    socket
      .in(socket.idPartie)
      .emit('message', { pseudo: socket.pseudo, message });

    socket.emit('message', { pseudo: socket.pseudo, message });
  });

  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('reussite', function (message: any) {
    message = ent.encode(message);
    // socket.broadcast.emit('reussite', { pseudo: socket.pseudo, message });
    io.to(socket.idPartie).emit('reussite', { pseudo: socket.pseudo, message });
  });
  socket.on('start', function (message: any) {
    socket
      .to(socket.idPartie)
      .emit('start', { pseudo: message, message: 'lance la partie' });
  });
  socket.on('dataPlaylist', function (dataPlaylist: any) {
    // dataPlaylist = ent.encode(dataPlaylist);
    // socket.broadcast.emit('reussite', { pseudo: socket.pseudo, message });
    io.in(socket.idPartie).emit('dataPlaylist', {
      id: socket.idPlaylist,
      dataPlaylist,
    });
  });
});
