import React, { useCallback, useEffect, useState } from "react";
import classnames from "classnames";
import "./styles.css";
import { INote } from "../../models/Note";

export const Home = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [noteName, setNoteName] = useState("");
  const [noteDescription, setNoteDescription] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      const data: INote[] = await fetch("api/notes").then((result) =>
        result.json()
      );

      setNotes(data);
    };
    fetchNotes();
  }, []);

  const deleteNote = useCallback(
    async (id: number) => {
      try {
        await fetch(`api/notes/${id}`, { method: "DELETE" }).then((result) => {
          if (!result.ok) {
            throw new Error();
          }
        });

        setNotes(notes.filter((note) => note.id !== id));
      } catch (error) {
        alert("Failed to delete note");
      }
    },
    [notes]
  );

  const handleCompleteClick = useCallback(
    async (id: number) => {
      const note = notes.find((note) => note.id === id);
      if (!note) {
        return;
      }
      try {
        await fetch(`api/notes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...note, completed: true }),
        });
        setNotes(
          notes.map((note) =>
            note.id === id ? { ...note, completed: true } : note
          )
        );
      } catch {
        alert("Failed to complete note");
      }
    },
    [notes]
  );

  const renderNote = useCallback(
    (note: INote) => (
      <div className="note-container" key={note.id}>
        <button
          className={classnames("note-button complete-button", {
            completed: note.completed,
          })}
          onClick={() => handleCompleteClick(note.id)}
          disabled={note.completed}
        >
          ✓
        </button>
        <div className="note-info">
          <p className="note-title">{note.title}</p>
          <p className="note-description">{note.description}</p>
        </div>
        <button
          onClick={() => deleteNote(note.id)}
          className="note-button delete-button"
        >
          X
        </button>
      </div>
    ),
    [deleteNote, handleCompleteClick]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!noteName || !noteDescription) {
        return;
      }
      try {
        const newNote = await fetch("api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: noteName,
            description: noteDescription,
          }),
        }).then((result) => result.json());

        setNotes([...notes, newNote]);
        setNoteDescription("");
        setNoteName("");
      } catch {
        alert("Failed to add note");
      }
    },
    [noteDescription, noteName, notes]
  );

  return (
    <div className="main-wrapper">
      <div className="main-container">
        <p className="main-title">Todo list</p>
        <form className="main-form" onSubmit={handleSubmit}>
          <input
            name="noteName"
            type="text"
            value={noteName}
            onChange={(event) => setNoteName(event.target.value)}
            className="main-input"
            placeholder="Enter note name"
          />
          <textarea
            name="noteDescription"
            value={noteDescription}
            onChange={(event) => setNoteDescription(event.target.value)}
            className="main-textarea"
            placeholder="Enter note description"
          />
          <button type="submit" className="form-button">
            Сохранить
          </button>
        </form>
        {notes.map((note) => renderNote(note))}
      </div>
    </div>
  );
};
