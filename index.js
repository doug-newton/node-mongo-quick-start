const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require('cors')
const path = require('path')

const mongoUrl = "mongodb://localhost:27017"
const dbName = "my-db-name"
const port = 8080

const app = express()

//  REMOVE THIS
app.use(cors())

app.use(express.json({limit: '64mb'}));

app.get('/api', (req, res) => {
    res.json({msg: 'hello world'})
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public_html/index.html');
});

app.use(express.static(path.join(__dirname, 'public_html')))

function gracefulShutdown() {
    app.locals.db_connection.close(() => {
        console.log("mongodb connection is closed")
        process.exit()
    })
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGKILL', gracefulShutdown);

MongoClient.connect(mongoUrl, (err, db) => {
    if (err) throw err;

    app.locals.db_connection = db;
    app.locals.db = db.db(dbName);

    app.listen(port, () => {
        console.log(`serving on port ${port}`)
    })
})
