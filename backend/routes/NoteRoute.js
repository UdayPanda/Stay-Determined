import { Router } from "express";
import { addNotes, deleteNote, getAllNotes } from "../controllers/NoteController.js";

const noteRoute = Router();

noteRoute.post("/add", addNotes);
noteRoute.post("/get", getAllNotes);
noteRoute.delete("/delete/:id", deleteNote);

export default noteRoute;
