import express from "express";
import { protect } from "../middleware/auth.js";
import Note from "../models/Note.js";

const router = express.Router();

// get all notes
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id });
    res.json(notes);
  } catch (error) {
    console.log("get all notes error", error);
    res.status(500).json({ message: "server error" });
  }
});

// create a note
router.post("/", protect, async (req, res) => {
  const { title, description , priority} = req.body;

  try {
    if (!title || !description || !priority) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const note = await Note.create({
      title,
      description,
      priority,
      createdBy: req.user._id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

// Get single note

router.get("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

// update note

router.put("/:id", protect, async (req, res) => {
  const { title, description, priority } = req.body;  // include priority
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }

    note.title = title || note.title;
    note.description = description || note.description;
    note.priority = priority || note.priority;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);  // <-- log the actual error
    res.status(500).json({ message: "server error" });
  }
});


// delete router
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "note not found!" });
    }
    await note.deleteOne();
    res.json({ message: "Note removed" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

// marked as complete
router.put('/complete/:id', protect, async (req, res) =>{
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
          return res.status(404).json({ message: "note not found!" });
        }
        note.isComplete = !note.isComplete;
        await note.save();
        res.json(note);
      } catch (err) {
        res.status(500).json({ message: "server error" });
      }
})

export default router;
