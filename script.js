try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch (e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}


var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');
var noteContent = '';

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);


recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function (event) {
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if (!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
    console.log(noteContent);

    //Start with this line mam
    if (noteContent == 'Google') {
      window.location.href = 'https://www.google.com/';
    }

    if (noteContent == 'gmail' || noteContent == 'Gmail') {
      window.location.href = 'https://www.gmail.com/';
    }

    if (noteContent == 'youtube' || noteContent == 'YouTube') {
      console.log("function called");
      window.location.href = 'https://www.youtube.com/';
    }

  }
};

recognition.onstart = function () {
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function () {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function (event) {
  if (event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');
  };
}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function (e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
});


$('#pause-record-btn').on('click', function (e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function () {
  noteContent = $(this).val();

})






/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions 
------------------------------*/

function renderNotes(notes) {
  var html = '';
  if (notes.length) {
    notes.forEach(function (note) {
      html += `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;
    });
  }
  else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}


function saveNote(dateTime, content) {
  localStorage.setItem('note-' + dateTime, content);
}


function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);

    if (key.substring(0, 5) == 'note-') {
      notes.push({
        date: key.replace('note-', ''),
        content: localStorage.getItem(localStorage.key(i))
      });
    }
  }
  return notes;
}


function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime);
}

