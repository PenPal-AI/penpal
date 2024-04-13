//QUILL THINGS

let OPENAI_API_KEY;

window.onload = () => {
  //  Listener to cache text on changes
  quill.on("text-change", () => {
    var text = quill.getSemanticHTML();
    localStorage.setItem("text", text);
  });

  //   Load cached text and set text editor contents
  var cachedText = localStorage.getItem("text") || "";
  quill.clipboard.dangerouslyPasteHTML(cachedText);
  OPENAI_API_KEY = prompt("Please enter your OpenAI API Key: ");
};

//modal / popup

var modal = document.getElementById("id01");
var textarea = document.getElementById("message-text");

//TODO:  TEXT TYPE AND ASSIGNMENT DETAILS TO BE SENT TO BACKEND
var textType = "";
var assignment = "";

function closeModal() {
  assignment = textarea.value;
  console.log(assignment);
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function setText(text) {
  var btn = document.getElementById("writing-type");
  textType = text;
  text = text + " ▼";
  btn.innerHTML = text;
}

//SUGGESTION GENERATION THINGS

//different modes, controlled by buttons
var isEditMode = false;

function writeMode() {
  isEditMode = false;
  hideButton();
  deleteEditingSuggestions();
  resetHighlights();
}

function suggestMode() {
  isEditMode = false;
  showButton();
  deleteEditingSuggestions();
  resetHighlights();
  // TODO: Update prompting
}

function generateAISuggestionWrapper() {
  generateAISuggestion(
    "Which sentences or ideas should be expanded on through analysis or additional evidence? Make suggestions as to how they can expand on meaningful analysis or additional evidence research.",
    textType,
    assignment,
    "Areas to expand on"
  );
  generateAISuggestion(
    "Explain why opening hooks are important and give an example of one which would fit into the text. Be very concise and use plain text.",
    textType,
    assignment,
    "Use an opening hook"
  );
  generateAISuggestion(
    "Provide guidance on narrative structure and pacing, giving one specific example of where the user can improve their flow",
    textType,
    assignment,
    "Narrative structure and pacing"
  );
}

function editMode() {
  if (!isEditMode) {
    isEditMode = true;
    hideButton();
    generateEdits();
  }
}

//filter for the text array
function filterFunction(value) {
  return (
    value != "" &&
    value != "a" &&
    value != "an" &&
    value != "the" &&
    value != "and" &&
    value != "or"
  );
}

//general list of items in suggestion list
var listItems = $(".list-group-item");

//cap for editing suggestions
let j = 0;

//generate word frequency edits
function generateWordFrequencyEdits(
  title = "Word Frequency Suggestion",
  word = "dummyWord",
  body = "You used the word ",
  body2 = " times. That's a lot! Try to find a synonym or restructure your sentences to use alternate words.",
  number = "22"
) {
  $(".list-group")
    .eq(0)
    .append(
      " <a href='#' wordattr='" +
        word +
        `' typeattr='freq'` +
        "onclick='selectCard(\"elem" +
        (j + 2).toString() +
        "\")' class='list-group-item editing-item list-group-item-action list-group-item-light flex-column align-items-start elem" +
        (j + 2).toString() +
        "'>" +
        "<div class='d-flex w-100 justify-content-between'>" +
        "<h5 class='mb-1'>" +
        title +
        "</h5>" +
        "<span class='badge badge-secondary badge-pill'>" +
        number +
        "</span> </div>" +
        "<p class='mb-1'>" +
        body +
        word +
        "' " +
        number +
        body2 +
        "</p></a>"
    );
  j++;
}

//tokenize text
function tokenize(text) {
  //quill editor functions

  //remove punctuation
  var punctuation = /[\.,?!]/g;
  var newLine = /\n/g;
  var newText = text.replace(punctuation, "");
  newText = newText.replace(newLine, "");

  //create text array and filter out whitespace and common words
  const textArray = newText.split(" ");
  return textArray.filter(filterFunction);
}

//generates editing suggestions
function generateEdits() {
  const text = quill.getText(0);
  const filteredTextArray = tokenize(text);

  //number of words in the array
  var numWords = filteredTextArray.length;

  //create a dictionary of object counts
  var count = {};

  for (k = 0; k < numWords; k++) {
    var word = filteredTextArray[k];
    if (count[word]) {
      count[word] += 1;
    } else {
      count[word] = 1;
    }
  }

  for (element in count) {
    if (count[element] / numWords >= 0.1 && count[element] > 2) {
      generateWordFrequencyEdits(
        "Word Frequency Suggestion",
        element,
        "You used the word '",
        " times. That's a lot! Try to find a synonym or restructure your sentences to use alternate words.",
        count[element]
      );
    }
  }

  //temporary way to generate suggestions
  numOfSuggestions = 4;
  title = "new suggestion";
  body = "body of suggestion";
  number = "22";

  if (j < 6) {
    for (let i = 0; i < numOfSuggestions; i++) {
      $(".list-group")
        .eq(0)
        .append(
          " <a href='#' onclick='selectCard(\"elem" +
            (j + 2).toString() +
            "\")' class='list-group-item editing-item list-group-item-action list-group-item-light flex-column align-items-start elem" +
            (j + 2).toString() +
            "'>" +
            "<div class='d-flex w-100 justify-content-between'>" +
            "<h5 class='mb-1'>" +
            title +
            "</h5>" +
            "<span class='badge badge-secondary badge-pill'>" +
            number +
            "</span> </div>" +
            "<p class='mb-1'>" +
            body +
            "</p></a>"
        );
      j++;
    }
  }
}

//delete editing suggestions when clicked away from the editing tab
function deleteEditingSuggestions() {
  listItems = $(".editing-item");
  for (let l = 0; l < listItems.length; l++) {
    const element = listItems[l];
    element.remove();
    j--;
  }
}

function showButton() {
  //show the generate AI suggestion button
  generateButton = $(".generate-button");
  for (let i = 0; i < generateButton.length; i++) {
    generateButton[i].classList.remove("generate-button-hide");
    generateButton[i].classList.add("generate-button-show");
  }
}

function hideButton() {
  //hide the generate AI suggestion button
  generateButton = $(".generate-button");
  for (let i = 0; i < generateButton.length; i++) {
    generateButton[i].classList.remove("generate-button-show");
    generateButton[i].classList.add("generate-button-hide");
  }
}

//tracks number of generated suggestions
var i = 0;

//generalized generate suggestions function
//currently uses a button
//when we generate suggestions in the backend, call this function
async function call_LLM(
  prompt = "Hello! Testing",
  text = "",
  writingStyle,
  assignmentDetails
) {
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  console.log(JSON.stringify(data));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();
  const message = res.choices[0].message.content;
  return message;
}

async function generateAISuggestion(
  prompt,
  writingStyle,
  assignmentDetails,
  title
) {
  //quill editor functions
  const text = quill.getText(0);

  const response = await call_LLM(
    prompt,
    text,
    writingStyle,
    assignmentDetails
  );
  body = response;

  $(".list-group")
    .eq(1)
    .append(
      " <a href='#' onclick='selectCard(\"elem" +
        (i + 6).toString() +
        "\")' class='list-group-item list-group-item-action list-group-item-light flex-column align-items-start elem" +
        (i + 6).toString() +
        "'>" +
        "<div class='d-flex w-100 justify-content-between'>" +
        "<h5 class='mb-1'>" +
        title +
        "</h5>" +
        "</div>" +
        "<p class='mb-1'>" +
        body +
        "</p></a>"
    );
  i++;
}

//makes suggestions selectable
function selectCard(elemNumber) {
  // Select all list items
  listItems = $(".list-group-item");

  // Remove 'active' tag for all list items
  for (let i = 0; i < listItems.length; i++) {
    listItems[i].classList.remove("active");
  }

  resetHighlights();

  // Add 'active' tag for currently selected item
  var element = document.querySelector("." + elemNumber); //.getElementById(elemNumber);
  element.classList.add("active");

  // get type of card
  if (element.getAttribute("typeattr") === "freq") {
    const selectedWord = element.getAttribute("wordattr");
    highlightWord(quill.getText(0), selectedWord);
  }
}

function resetHighlights() {
  // Unhighlight currently highlighted text
  const currentlyHighlighted = document.querySelectorAll(
    "span[style='color: red;']"
  );
  currentlyHighlighted.forEach((element) => {
    element.style["color"] = "#000";
  });
}

function getIndicesOfSubstring(string, substring) {
  let indices = [];

  // Regular expression to match word boundaries
  let regex = new RegExp("\\b" + substring + "\\b", "gi");

  // Loop through matches
  while ((match = regex.exec(string)) !== null) {
    indices.push(match.index);
  }

  return indices;
}

function highlightWord(str, selectedWord) {
  // Reset other highlights

  const startingIndices = getIndicesOfSubstring(str, selectedWord);
  for (startIndex of startingIndices) {
    quill.formatText(startIndex, selectedWord.length, "color", "red");
  }
}
