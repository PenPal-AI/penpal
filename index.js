//QUILL THINGS

let OPENAI_API_KEY;

window.onload = () => {
  OPENAI_API_KEY = prompt("Please enter your OpenAI API Key: ");
  //  Listener to cache text on changes
  quill.on("text-change", () => {
    var text = quill.getSemanticHTML();
    localStorage.setItem("text", text);
  });

  //   Load cached text and set text editor contents
  var cachedText = localStorage.getItem("text") || "";
  quill.clipboard.dangerouslyPasteHTML(cachedText);
};

//modal / popup

var modal = document.getElementById("id01");
var textarea = document.getElementById("message-text");

//TODO:  TEXT TYPE AND ASSIGNMENT DETAILS TO BE SENT TO BACKEND
var textType = "Other";
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
  generateAISuggestion(
    ("Give the user suggestions to improve the flow of their writing",
    textType, assignment)
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
  /*
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
  */
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

function getprompt(writingStyle, assignment){
  
  if (writingStyle == "Email / Communication"){
    prompt = "**Subject/Objective**\
    What is an appropriate subject line for this email? Give 3 suggestions.\
    If there is no clear question, prompt the user to clarify their ask.\
    Are there proper greetings/sign-off?\
    Is there a heading line?\
    Are there closing salutations?\
    Is there a signature after the closing remarks? Suggest one, if not.\
    **Tone**\
    Are there instances of casual or rude tone? Quote an example from the text. If there is no example, return null.\
    ";
  } else if (writingStyle == "Research Paper"){
    prompt = "**Research paper objective**\
    Is there a clear research question? Does it align with the given assignment description? How can the research question be improved? Could the research question be moved to a different place in the paper?\
    Does the thesis comprehensively answer the research question? Does the thesis comprehensively answer the assignment directions?]\
    How can the thesis be more analytical?\
    **Argument alignment**\
    Are the arguments mentioned in the thesis found in the body paragraph main points? (pushing too much?)\
    How can flow from each main argument improve? \
    How can transitions from each argument improve? Quote an example from the text. If there is no example, return null. \
    Do the main points of the writing sample answer the research question? How can the main points be more targeted and directly answer the research question? \
    ** Areas to expand on:** \
    Are there any evidence points that need additional analysis? Give the user prompts for analyzing the evidence deeper.\
    What main points need to be expanded on? Quote an example from the text. If there is no example, return null. \
    ";
  } else if (writingStyle == "Persuasive Essay"){
    prompt = "**Argumentative stance (take a clear position)**\
    State the writer's main argument. How can the user take a more clear argumentative stance?\
    State the writer's main argument. What are some areas that the user can improve their stance clarity?\
    State the writer's main argument. Does this argumentative stance answer the assignment description? Return null if the user did not input an assignment description.\
    What areas of the argument can be expanded upon?\
    **Counter Arguments**\
    Look for a counter argument in the writer's work. What are some counter arguments the user can expand upon? Quote an example from the text. If there is no example, return null. \
    Look for a current counter argument in the writer's work. What are some counter argumentative prompts to look into and expand on?\
    **Tone**\
    Quote some areas where the user does not employ an objective tone. \
    Offer suggestions on how to create a more objective tone.";
  } else {
    prompt = "Give the user suggestions to improve the flow of their writing?";
  }

  return prompt;

}

async function call_LLM(text = "", prompt = "hello! Testing", writingStyle, assignment) {
  prompt = getprompt(textType)
  console.log(prompt)
  console.log(textType)
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI agent intended to help users learn to write. Provide helpful suggestions to help users improve their writing skills.\
          Generate 10 distinct individual suggestions",
      },
      {
        role: "system",
        content: "The user will supply input text. Your prompt is: ${prompt} \
        The user is writing a ${textType}, so give them suggestions specific to that style, referencing specific point (examples) in their writing where they can improve. \
        The user's goal is: ${assignment}, verify that the user's writing is on track to meet that goal. If the user's writing does not seem to match the  ${textType} writing style, mention that as a suggestion."
      }, 

      {
        role: "system",
        content: "Return a list of 10 distinct indivudal suggestions. Limit the response of each individual suggestion to 200 tokens to keep each suggestion concise. There should be 10 indiviudal suggestions so the repsonse should not exceed 2000 tokens\
          Provide one specific example and actionable advice with references to the user's text. Do not rewrite more than one sentence for them.",
      },

      {
        role: "system",
        content:
          "Generate the output of the suggestions so that there is a short title and a body of text. The title should be the main topic (a summary) the suggestion, and the body should contain the suggestion itself. The format should look like this:\
           **Title:** 'Title of suggestion' **Body:** 'Body of suggestion'",
      },
 
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 1,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

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

async function generateAISuggestion(prompt, writingStyle, assignment) {
  //quill editor functions
  const text = quill.getText(0);

  const response = await call_LLM( text, prompt, writingStyle, assignment);
  title = "output from LLM";
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
