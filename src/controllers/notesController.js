import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const id = req.params.noteId;
  const noteById = await Note.findById(id);

  if (!noteById) {
    throw createHttpError(404, 'Note not Found');
  }
  res.status(200).json(noteById);
};

export const createNote = async (req, res) => {
  const newNote = req.body;
  const createdNote = await Note.create(newNote);
  res.status(201).json(createdNote);
};

export const deleteNote = async (req, res) => {
  const id = req.params.noteId;
  const deletedNote = await Note.findByIdAndDelete(id);

  if (!deletedNote) {
    throw createHttpError(404, 'Note not Found');
  }

  res.status(200).json(deletedNote);
};

export const updateNote = async (req, res) => {
  const id = req.params.noteId;
  const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
    returnDocument: 'after',
  });
  if (!updatedNote) {
    throw createHttpError(404, 'Note not Found');
  }

  res.status(200).json(updatedNote);
};
