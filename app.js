// Wait for the page to be fully loaded before running our code
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the important HTML elements
    const noteForm = document.getElementById('note-form');
    const noteInput = document.getElementById('note-input');
    const notesList = document.getElementById('notes-list');

    // --- 1. Load and display existing notes from localStorage ---
    
    // Function to get notes from localStorage
    function getNotes() {
        // Get the notes string, or an empty array '[]' if no notes exist
        const notes = localStorage.getItem('quickNotes');
        return notes ? JSON.parse(notes) : [];
    }

    // Function to save all notes back to localStorage
    function saveNotes(notes) {
        // localStorage can only store strings, so we convert our array
        localStorage.setItem('quickNotes', JSON.stringify(notes));
    }

    // Function to display notes on the page
    function renderNotes() {
        // Clear the current list
        notesList.innerHTML = '';
        
        // Get all notes
        const notes = getNotes();
        
        // Loop through each note and create an HTML element for it
        notes.forEach((noteText, index) => {
            const li = document.createElement('li');
            
            // Create a span to hold the note text
            const noteContent = document.createElement('span');
            noteContent.className = 'note-content';
            
            // Check if the note is a link and make it clickable
            if (isURL(noteText)) {
                noteContent.innerHTML = `<a href="${noteText}" target="_blank" rel="noopener noreferrer">${noteText}</a>`;
            } else {
                noteContent.textContent = noteText;
            }
            
            // Create a delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            
            // Add an event listener to the delete button
            deleteBtn.addEventListener('click', () => {
                deleteNote(index);
            });
            
            // Add the content and button to the list item
            li.appendChild(noteContent);
            li.appendChild(deleteBtn);
            
            // Add the list item to the main list
            notesList.appendChild(li);
        });
    }

    // --- 2. Add a new note ---
    
    noteForm.addEventListener('submit', (e) => {
        // Prevent the form from refreshing the page
        e.preventDefault(); 
        
        const newNoteText = noteInput.value.trim(); // Get text and remove whitespace
        
        if (newNoteText) {
            const notes = getNotes();
            notes.push(newNoteText); // Add the new note to our array
            saveNotes(notes);       // Save the updated array
            renderNotes();          // Re-display all notes
            noteInput.value = '';   // Clear the input box
        }
    });

    // --- 3. Delete a note ---
    
    function deleteNote(indexToDelete) {
        const notes = getNotes();
        // Create a new array *without* the note at the specified index
        const updatedNotes = notes.filter((_, index) => index !== indexToDelete);
        saveNotes(updatedNotes); // Save the new, smaller array
        renderNotes();           // Re-display the notes
    }

    // --- 4. Helper function to check for URLs ---
    
    function isURL(str) {
        // A simple check to see if the text looks like a URL
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    // --- Initial Load ---
    // Load and display notes the first time the page is opened
    renderNotes();
});