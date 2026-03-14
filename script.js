const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

// Load notes
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Function to determine readable text color
function getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace("#","");
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);

    if(r>200 && g>200 && b>200) return "black";
    if(r<55 && g<55 && b<55) return "white";

    const luminance = 0.299*r + 0.587*g + 0.114*b;
    return (luminance >= 128) ? "black" : "white";
}

// Theme
function updateThemeButtonText() {
    if(document.body.classList.contains("dark-mode")){
        themeToggle.textContent = "🌙 Dark Mode";
    } else {
        themeToggle.textContent = "☀️ Light Mode";
    }
}

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}
updateThemeButtonText();

themeToggle.onclick = ()=>{
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    updateThemeButtonText();
};

function saveNotes(){
    localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes(){
    notesContainer.innerHTML = "";
    const sortedNotes = notes.slice().sort((a,b)=> b.pinned - a.pinned);

    sortedNotes
    .filter(noteObj => noteObj.text.toLowerCase().includes(searchInput.value.toLowerCase()))
    .forEach((noteObj, index)=>{
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        noteDiv.style.background = noteObj.color || "#ffeb3b";

        // Default text color black for new notes
        if(!noteObj.color) {
            noteDiv.style.color = "#000";
        } else {
            noteDiv.style.color = getContrastYIQ(noteDiv.style.background);
        }

        const noteText = document.createElement("p");
        noteText.textContent = noteObj.text;

        const timestamp = document.createElement("small");
        timestamp.textContent = noteObj.lastEdited ? `Last edited: ${noteObj.lastEdited}` : "";
        timestamp.style.display = "block";
        timestamp.style.marginTop = "5px";
        timestamp.style.fontSize = "12px";
        timestamp.style.color = noteDiv.style.color;

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("note-buttons");

        // Pin
        const pinBtn = document.createElement("button");
        pinBtn.textContent = noteObj.pinned ? "📌 Pinned" : "📌 Pin";
        pinBtn.classList.add("pin-btn");
        pinBtn.onclick = ()=>{
            noteObj.pinned = !noteObj.pinned;
            saveNotes();
            renderNotes();
        };

        // Edit
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.onclick = ()=>{
            const newText = prompt("Edit your note", noteObj.text);
            if(newText !== null){
                noteObj.text = newText;
                noteObj.lastEdited = new Date().toLocaleString();
                saveNotes();
                renderNotes();
            }
        };

        // Delete
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

        // Color change button (post-creation)
        const colorBtn = document.createElement("button");
        colorBtn.textContent = "🎨 Color";
        colorBtn.classList.add("edit-btn");
        colorBtn.onclick = ()=>{
            const colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.value = noteObj.color || "#ffeb3b";
            colorInput.onchange = ()=>{
                noteObj.color = colorInput.value;
                noteDiv.style.background = noteObj.color;
                noteDiv.style.color = getContrastYIQ(noteObj.color);
                timestamp.style.color = getContrastYIQ(noteObj.color);
                saveNotes();
            };
            colorInput.click();
        };

        btnContainer.appendChild(pinBtn);
        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);
        btnContainer.appendChild(colorBtn);

        noteDiv.appendChild(noteText);
        noteDiv.appendChild(timestamp);
        noteDiv.appendChild(btnContainer);

        notesContainer.appendChild(noteDiv);
    });
}

addBtn.onclick = ()=>{
    const noteText = noteInput.value.trim();
    if(noteText === "") return;

    const timestamp = new Date().toLocaleString();
    notes.push({
        text: noteText,
        pinned: false,
        lastEdited: timestamp,
        color: null // default note uses null → black text
    });

    saveNotes();
    renderNotes();
    noteInput.value = "";
};

searchInput.addEventListener("input", renderNotes);
renderNotes();