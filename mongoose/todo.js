let mongoose = require("mongoose");

let toDoSchema = new mongoose.Schema({
    itemId: Number,
    item: String,
    completed: Boolean
}, { collection: "TodoList" });

let ToDo = mongoose.model('ToDo', toDoSchema);

module.exports = ToDo;
