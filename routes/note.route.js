import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controller/note.controller.js";

const router = Router();

router.post("/create", protectRoute, createNote)
router.get("/", protectRoute, getAllNotes);
router.get("/:id", protectRoute, getNoteById);
router.put("/:id", protectRoute, updateNote)
router.delete("/:id", protectRoute, deleteNote)

export default router;