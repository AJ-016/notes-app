const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

// Load notes
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Theme functions
function updateThemeButtonText() {
    if(document.body.classList.contains("dark-mode")){
        themeToggle.textContent = "🌙 Dark Mode"; // shows current mode
    } else {
        themeToggle.textContent = "☀️ Light Mode"; // shows current mode
    }
}

// Load saved theme
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}
updateThemeButtonText();

themeToggle.onclick = ()=>{
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    updateThemeButtonText();
};

// Save notes
function saveNotes(){
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Render notes
function renderNotes(){
    notesContainer.innerHTML = "";

    const sortedNotes = notes.slice().sort((a,b)=> b.pinned - a.pinned);

    sortedNotes
    .filter(noteObj => noteObj.text.toLowerCase().includes(searchInput.value.toLowerCase()))
    .forEach((noteObj, index)=>{
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");

        const noteText = document.createElement("p");
        noteText.textContent = noteObj.text;

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("note-buttons");

        // Pin button
        const pinBtn = document.createElement("button");
        pinBtn.textContent = noteObj.pinned ? "📌 Pinned" : "📌 Pin";
        pinBtn.classList.add("pin-btn");
        pinBtn.onclick = ()=>{
            noteObj.pinned = !noteObj.pinned;
            saveNotes();
            renderNotes();
        };

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.onclick = ()=>{
            const newText = prompt("Edit your note", noteObj.text);
            if(newText !== null){
                noteObj.text = newText;
                saveNotes();
                renderNotes();
            }
        };

        // Delete button with pinned confirmation
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = ()=>{
            if(noteObj.pinned){
                const confirmDelete = confirm("This note is pinned. Are you sure you want to delete it?");
                if(!confirmDelete) return;
            }
            notes.splice(index,1);
            saveNotes();
            renderNotes();
        };

        btnContainer.appendChild(pinBtn);
        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);

        noteDiv.appendChild(noteText);
        noteDiv.appendChild(btnContainer);

        notesContainer.appendChild(noteDiv);
    });
}

// Add new note
addBtn.onclick = ()=>{
    const noteText = noteInput.value.trim();
    if(noteText === "") return;

    notes.push({text: noteText, pinned: false});
    saveNotes();
    renderNotes();
    noteInput.value = "";
};

// Search
searchInput.addEventListener("input", renderNotes);

// Initial render
renderNotes();