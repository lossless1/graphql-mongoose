let ToDo = require("./mongoose/todo");
let path = require("path");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let express = require("express");
let graphqlHTTP = require("express-graphql");
let schema = require("./graphql/Schema/Schema");
let nconf = require("nconf");
nconf.argv().env().file({ file: "./config/main.json" });

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(`mongodb://${nconf.get("mongo:host")}:${nconf.get("mongo:port")}/${nconf.get("mongo:db")}`, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', () => {
    console.log('--FAILED')
});

db.once('open', () => {
    console.log('+++Connected to mongoose')
});

// start the server
app.get('/quotes', (req, res) => {

});

app.post('/quotes', (req, res) => {
    // Insert into TodoList Collection
    let todoItem = new ToDo({
        itemId: 1,
        item: req.body.item,
        completed: false
    });
    todoItem.save((err, result) => {
        if (err) {
            console.log("---TodoItem save failed " + err)
        }
        console.log("+++TodoItem saved successfully " + todoItem.item);
        res.redirect('/')
    })
});
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: nconf.get("graphQL:showInterface")
}));

app.get('/', (req, res) => {
    res.sendFile(path.resolve() + '/index.html');
});
app.listen(nconf.get("server:port"), () => {
    console.log("+++Express Server is Running!!!");
});
