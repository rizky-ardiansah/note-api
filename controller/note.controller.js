import Note from "../models/note.model.js";

export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user._id;

        if (!title || !content) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const note = await Note.create({
            title,
            content,
            user: userId,
        });

        await note.save();

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: {
                note: note,
            },
        });
    } catch (error) {
        console.error("Create note error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id });

        if (!notes) {
            return res.status(404).json({ message: "No notes found" });
        }

        res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: {
                notes: notes,
            },
        });

    } catch (error) {
        console.error("Get all notes error:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}

export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            success: true,
            message: "Note fetched successfully",
            data: {
                note: note,
            },
        });

    } catch (error) {
        console.error("Get note by ID error:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}

export const updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const note = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: {
                note: note,
            },
        });

    } catch (error) {
        console.error("Update note error:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}

export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });

    } catch (error) {
        console.error("Delete note error:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}