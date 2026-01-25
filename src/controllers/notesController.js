import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
export const getAllNotes = async (req, res, next) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  //   {
  //   page: 1
  //   perPage: 15,
  //   totalNotes: 150,
  //   totalPages: 10,
  //   notes: [/* масив нотаток */]
  // }
  const notesQuery = Note.find();
  if (tag) {
    notesQuery.where({ tag });
  }

  if (search) {
    notesQuery.where({
      $text: { $search: search },
    });
  }
  const [totalNotes, allNotes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);
  const totalPages = Math.ceil(totalNotes / perPage);
  res.status(200).json({
    page: page,
    perPage: perPage,
    totalNotes: totalNotes,
    totalPages: totalPages,
    notes: allNotes,
  });
};
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);
  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.status(200).json(note);
};
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndDelete({ _id: noteId });
  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });
  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.status(200).json(note);
};
