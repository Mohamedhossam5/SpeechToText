const Note = require("../models/note");

exports.getAddNote = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("add-note", {
    path: "/add-note",
    user: req.session.user,
    editing: false,
  });
};

exports.postAddNote = (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;

  const note = new Note({ title: title, text: text, userId: req.user });

  note
    .save()
    .then((result) => {
      console.log("Note added!");
      res.redirect("/notes");
    })
    .catch((err) => {
      console.log(err);
      throw "Could not add the note!";
    });
};

exports.getAllNotes = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  Note.find()
    .then((notes) => {
      res.render("notes", {
        notes: notes,
        user: req.session.user,
        path: "/notes",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditNote = (req, res, next) => {
  const noteId = req.params.noteId;
  Note.findById(noteId)
    .then((note) => {
      if (!note) {
        return res.redirect("/notes");
      }
      res.render("edit-note", {
        path: "/edit-note",
        note: note,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditNote = (req, res, next) => {
  const noteId = req.params.noteId;
  const updatedTitle = req.body.title;
  const updatedText = req.body.text;

  Note.findById(noteId)
    .then((note) => {
      note.title = updatedTitle;
      note.text = updatedText;
      return note.save();
    })
    .then((result) => {
      console.log("Updated the note!");
      return res.redirect("/notes");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteNote = (req, res, next) => {
  const noteId = req.params.noteId;

  Note.findByIdAndDelete(noteId)
    .then(() => {
      console.log("Deleted note!");
      res.redirect("/notes");
    })
    .catch((err) => {
      console.log(err);
    });
};
