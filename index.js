//QUILL THINGS
window.onload = () => {
  //  Listener to cache text on changes
  quill.on("text-change", () => {
    var text = quill.getSemanticHTML();
    localStorage.setItem("text", text);
  });

  //   Load cached text and set text editor contents
  var cachedText = localStorage.getItem("text") || "";
  quill.clipboard.dangerouslyPasteHTML(cachedText);
};

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
async function generateAISuggestion(
  body = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  title = "new AI suggestion"
) {
  //quill editor functions
  const text = quill.getText(0);

  title = "Suggestion";
  body = "output from Claude";

  //TODO FOR THE BACKEND: instead of console.logging the text, send to Claude!
  try {
    const formattedCorrections = await sendTextToBackend();
    console.log(formattedCorrections);
    body = formattedCorrections;
    console.log(body); // Now you have access to the updated 'body' variable
  } catch (error) {
      console.error('Error:', error);
  }


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

  console.log(element);
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

function getIndicesOfSubstring(str, substring) {
  const startingIndices = [];
  let indexOccurence = str.indexOf(substring, 0);

  while (indexOccurence >= 0) {
    startingIndices.push(indexOccurence);

    indexOccurence = str.indexOf(substring, indexOccurence + 1);
  }
  return startingIndices;
}

function highlightWord(str, selectedWord) {
  // Reset other highlights

  const startingIndices = getIndicesOfSubstring(str, selectedWord);
  for (startIndex of startingIndices) {
    quill.formatText(startIndex, selectedWord.length, "color", "red");
  }
}
