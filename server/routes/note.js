const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note");
const auth = require("../middlewares/auth");


router.post('/',auth.auth, noteController.addNote);

router.get("/",auth.auth, noteController.getAllNotes);

router.patch("/:noteId", auth.auth,noteController.editNote);

router.delete("/:noteId", auth.auth,noteController.deleteNote);


module.exports = router;