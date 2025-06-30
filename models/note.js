const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    text: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
});


module.exports = mongoose.model("Notes", NoteSchema);