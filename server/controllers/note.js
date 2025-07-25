const { ReturnDocument } = require("mongodb");
const Note = require("../models/note");

exports.addNote = async (req, res) => {
  const title = req.body.title;
  const text = req.body.text;

  try {
    const note = new Note({ title: title, text: text, userId: req.user.id });

    const savedNote = await note.save();

    res.status(201).json(savedNote);

  } catch(err) {
    console.log(`this error happend ${err}`);
    res.status(501).json({error:'Could not add note'});
    };
}

exports.getAllNotes = async (req, res) => {

  try {

    const notes = await Note.find({userId: req.userId});

    if (notes.length === 0) {
      return res.status(404).json({error:"Can't find the notes"});
    }

    res.status(200).json(notes);

  } catch(err) {
    console.log(err);
    res.status(501).json({error:"Couldn't get all notes!"});
  }

};

exports.editNote = async (req, res) => {
  const noteId = req.params.noteId;
  const updatedTitle = req.body.title;
  const updatedText = req.body.text;


  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({error:"Can't find the note!"});
    }

    note.title = updatedTitle;
    note.text = updatedText;

    const editedNote = await note.save();

    res.status(201).json(editedNote)

  } catch(err){
    console.log(err);
    res.status(501).json({error:"Couldn't edit the note!"});
  }
};

exports.deleteNote = async (req, res) => {
  const noteId = req.params.noteId;

  try {
    await Note.findByIdAndDelete(noteId);

    res.status(200).json({Message:"Deleted!"});
  } catch(err){
    res.status(501).json({error:"Couldn't delete the note"});
  }
};