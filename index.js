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

//general list of items in suggestion list
var listItems = $(".list-group-item");

//readies functions on load
//$(document).ready(function () { 
  /*

  //Fancy way of making suggestions selectable (doesn't work)

  $(".list-group-item").click(function() { 
                
    // Select all list items 
    listItems = $(".list-group-item"); 
    console.log(listItems);
      
    // Remove 'active' tag for all list items 
    for (let i = 0; i < listItems.length; i++) { 
        listItems[i].classList.remove("active"); 
    } 
      
    // Add 'active' tag for currently selected item 
    this.classList.add("active"); 
  }); 
  */
  /*
  //generate new suggestions (4 upon load)
  //uses the fancy Jquery/Bootstrap stuff
  //$('.suggest').click(function() {
  numOfSuggestions = 4;
  title = "new suggestion";
  body = "body of suggestion";
  number = "22";

  if (id == "pills-edit") {
  for (let i = 0; i < numOfSuggestions; i++) {

    $(".list-group").append(
      " <a href='#' onclick='selectCard(\"elem" +
        (i + 2).toString() +
        "\")' class='list-group-item list-group-item-action list-group-item-light flex-column align-items-start elem" +
        (i + 2).toString() +
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
        "!</p></a>"
    );
  } }

  //});
}); */

//cap for editing suggestions
let j = 0;

function generateEdits() {

  //hide the generate AI suggestion button
  generateButton = $(".generate-button");      
  for (let i = 0; i < generateButton.length; i++) {   
    generateButton[i].classList.remove("generate-button-show");
    generateButton[i].classList.add("generate-button-hide");
  }

  numOfSuggestions = 4;
  title = "new suggestion";
  body = "body of suggestion";
  number = "22";

  if (j < 6) {

  for (let i = 0; i < numOfSuggestions; i++) {

    $(".list-group").eq(0).append(
      " <a href='#' onclick='selectCard(\"elem" +
        (j + 2).toString() +
        "\")' class='list-group-item list-group-item-action list-group-item-light flex-column align-items-start elem" +
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
        "!</p></a>"
    );
    j++;
  } }
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
//currently uses a button, but this is just for demo purposes
//when we generate suggestions in the backend, call this function
function generateAISuggestion(
  body = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  title = "new AI suggestion"
) {  

  $(".list-group").eq(1).append(
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
      "!</p></a>"
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

  // Add 'active' tag for currently selected item
  var element = document.querySelector("." + elemNumber); //.getElementById(elemNumber);
  element.classList.add("active");
}
