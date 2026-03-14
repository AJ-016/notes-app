const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes(){
localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes(){
notesContainer.innerHTML = "";

notes.forEach((note, index)=>{

const noteDiv = document.createElement("div");
noteDiv.classList.add("note");

const noteText = document.createElement("p");
noteText.textContent = note;

const btnContainer = document.createElement("div");
btnContainer.classList.add("note-buttons");

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";
deleteBtn.classList.add("delete-btn");

deleteBtn.onclick = ()=>{
notes.splice(index,1);
saveNotes();
renderNotes();
};

const editBtn = document.createElement("button");
editBtn.textContent = "Edit";
editBtn.classList.add("edit-btn");

editBtn.onclick = ()=>{
const newNote = prompt("Edit your note", note);

if(newNote !== null){
notes[index] = newNote;
saveNotes();
renderNotes();
}
};

btnContainer.appendChild(editBtn);
btnContainer.appendChild(deleteBtn);

noteDiv.appendChild(noteText);
noteDiv.appendChild(btnContainer);

notesContainer.appendChild(noteDiv);

});
}

addBtn.onclick = ()=>{

const noteText = noteInput.value.trim();

if(noteText === "") return;

notes.push(noteText);

saveNotes();
renderNotes();

noteInput.value = "";

};

renderNotes();