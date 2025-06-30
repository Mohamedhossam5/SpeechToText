const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note");


router.get("/add-note", noteController.getAddNote);

router.post('/add-note', noteController.postAddNote);

router.get("/notes", noteController.getAllNotes);

// router.post("notes", noteController.postAllNotes);

router.get('/edit-note/:noteId', noteController.getEditNote);

router.post("/edit-note/:noteId", noteController.postEditNote);

router.post("/delete-note/:noteId", noteController.postDeleteNote);


module.exports = router;