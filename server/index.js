const express = require('express');
const server = express();
const PORT = 3000;

server.use(express.static('../client'));

server.listen(PORT, () => console.log(`server listening on port: ${PORT}`));