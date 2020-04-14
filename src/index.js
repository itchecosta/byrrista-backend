require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');


const PORT = process.env.PORT || 3333;
//const INDEX = '/index.html';

//const server = express().use((req, res) => res.sendFile(INDEX, { root: __dirname }));

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(
  process.env.MONGO_URL, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
