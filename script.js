const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

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

function updateThemeButtonText() {
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "🌙 Dark Mode" : "☀️ Light Mode";
}

if(localStorage.getItem("theme")==="dark") document.body.classList.add("dark-mode");
updateThemeButtonText();

themeToggle.onclick = ()=>{
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode")?"dark":"light");
    updateThemeButtonText();
};

function saveNotes(){ localStorage.setItem("notes", JSON.stringify(notes)); }

function renderNotes(){
    notesContainer.innerHTML = "";
    const sortedNotes = notes.slice().sort((a,b)=> b.pinned - a.pinned);

    sortedNotes.filter(noteObj=> noteObj.text.toLowerCase().includes(searchInput.value.toLowerCase()))
    .forEach((noteObj, index)=>{
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        noteDiv.style.background = noteObj.color || "#ffeb3b";

        if(!noteObj.color){
            noteDiv.style.color = "#000"; // default text for yellow notes
        } else {
            noteDiv.style.color = getContrastYIQ(noteDiv.style.background);
        }

        const noteText = document.createElement("p");
        noteText.textContent = noteObj.text;

        const timestamp = document.createElement("small");
        timestamp.textContent = noteObj.lastEdited ? `Last edited: ${noteObj.lastEdited}` : "";
        timestamp.style.display="block";
        timestamp.style.marginTop="5px";
        timestamp.style.fontSize="12px";
        timestamp.style.color = noteDiv.style.color;

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("note-buttons");

        const pinBtn = document.createElement("button");
        pinBtn.textContent = noteObj.pinned?"📌 Pinned":"📌 Pin";
        pinBtn.classList.add("pin-btn");
        pinBtn.onclick = ()=>{
            noteObj.pinned = !noteObj.pinned;
            saveNotes();
            renderNotes();
        };

        const editBtn = document.createElement("button");
        editBtn.textContent="Edit";
        editBtn.classList.add("edit-btn");
        editBtn.onclick = ()=>{
            const newText = prompt("Edit your note", noteObj.text);
            if(newText!==null){
                noteObj.text = newText;
                noteObj.lastEdited = new Date().toLocaleString();
                saveNotes();
                renderNotes();
            }
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent="Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = ()=>{
            if(noteObj.pinned && !confirm("This note is pinned. Are you sure you want to delete it?")) return;
            notes.splice(index,1);
            saveNotes();
            renderNotes();
        };

        const colorBtn = document.createElement("button");
        colorBtn.textContent="🎨 Color";
        colorBtn.classList.add("color-btn"); 
        colorBtn.onclick = ()=>{
            const colorInput = document.createElement("input");
            colorInput.type="color";
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

        btnContainer.append(pinBtn, editBtn, deleteBtn, colorBtn);
        noteDiv.append(noteText, timestamp, btnContainer);
        notesContainer.appendChild(noteDiv);
    });
}

addBtn.onclick = ()=>{
    const noteText = noteInput.value.trim();
    if(!noteText) return;
    notes.push({
        text: noteText,
        pinned: false,
        lastEdited: new Date().toLocaleString(),
        color: null
    });
    saveNotes();
    renderNotes();
    noteInput.value="";
};

searchInput.addEventListener("input", renderNotes);
renderNotes();