import Server from './server';

const port = parseInt(process.env.PORT);

const notesServer = new Server(port)
  .start()
  .then((server) => console.log(`Notes server is running on port ${server.getPort()}`))
  .catch((err) => console.log(err));

export default notesServer;
