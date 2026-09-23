import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const skip = (page - 1) * perPage;

  const myQuery = Note.find({userId: req.user._id});

  if (tag) {
    myQuery.where('tag').equals(tag);
  }

  if (search) {
    myQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const [totalNotes, notes] = await Promise.all([
    myQuery.clone().countDocuments(),
    myQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({ page, perPage, totalNotes, totalPages, notes });
};

export const getNoteById = async (req, res) => {
  const id = req.params.noteId;
  const noteById = await Note.findOne({_id: id, userId: req.user._id});

  if (!noteById) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(noteById);
};

export const createNote = async (req, res) => {
  const newNote = req.body;
  const createdNote = await Note.create({
    ...newNote,
    userId: req.user._id
  });
  res.status(201).json(createdNote);
};

export const deleteNote = async (req, res) => {
  const id = req.params.noteId;
  const deletedNote = await Note.findOneAndDelete({_id: id, userId: req.user._id});

  if (!deletedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(deletedNote);
};

export const updateNote = async (req, res) => {
  const id = req.params.noteId;
  const updatedNote = await Note.findOneAndUpdate({_id: id, userId: req.user._id}, req.body, {
    returnDocument: 'after',
  });
  if (!updatedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updatedNote);
};
