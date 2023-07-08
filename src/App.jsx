import React, {useState, useEffect} from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db } from "./firebase";
import "./App.css";

export default function App() {
  const [notes, setNotes] = useState([]);

  const [currentNoteId, setCurrentNoteId] = useState(() => notes[0]?.id || "");

  const [tempNoteText, setTempNoteText] = useState(""); // store update text temporarly to apply debouncing and reduce firebase access overhead
 
  const currentNote = notes.find((note) => note.id === currentNoteId) || notes[0]; // updates on every rerender, unlike the states above

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt); // updates on every rerender, unlike the states above


  // useEffect to add onSnapshot event listener
  useEffect(() => {
    let unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      const notesArr = snapshot.docs.map((doc) => ({
        // 3ady 3l docs array mel snapshot ely gatlena we farrat el data bta3etha fe object + e3melaha id yrefer le id el doc fel firebase
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    console.log(currentNoteId);
    return unsubscribe;
  }, []);

  // useEffect to update tempNoteText on currentNote Change
  useEffect(()=>{
    if (currentNote){
      setTempNoteText(currentNote.body);
    }
  },[currentNote])

  // useEffect to handle debouncing
  useEffect(()=>{
    let timer = setTimeout(() => {
      if (currentNote.body!== tempNoteText){
        updateNote(tempNoteText)
      }
    }, 700);
    return ()=> clearTimeout(timer)
  },[tempNoteText])




  // creating a new note 
  async function createNewNote() {
    const newNote = {
      // id: nanoid(), -- we no longer need this
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    // setNotes((prevNotes) => [newNote, ...prevNotes]); -- we won't set notes state directly, we'll depend on snapshot
    let newNoteAdded = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteAdded.id);
  }

  // update a note
  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId); // get reference to doc
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    );
  }

  // delete a note
  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId); // get reference to doc
    await deleteDoc(docRef);
  }

  return (
    <main>
      {/*If there are notes*/}
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />

          <Editor tempNoteText={tempNoteText} setTempNoteText={setTempNoteText} />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
