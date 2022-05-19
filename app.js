const express = require('express');
const cors = require('cors');
const queryRoutes = require('./routes/query');
const browseRoutes = require('./routes/browse');

let app = express();

app.use(cors(), express.json());

app.get("/", (req, res) => {
    res.send("<h1>Hello from OPC UA Proxy</h1>")
})

app.use("/query", queryRoutes);
app.use("/browse", browseRoutes);

app.listen(3000);