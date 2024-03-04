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



var listItems = $(".list-group-item"); 

//BUG/TODO: GENERATED SUGGESTIONS (VIA BUTTON) ARE NOT SELECTABLE. NO CLUE WHY THIS HAPPENS
$(document).ready(function(){

  //makes suggestions selectable
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
  
  //generate new suggestion
  //currently uses a button, but this is just for demo purposes
  //when we generate suggestions in the backend, call this function
  //$('.suggest').click(function() {
      numOfSuggestions = 4;
      title = "new suggestion";  
      body = "body of suggestion";
      number = "22";

      for (let i = 0; i < numOfSuggestions; i++) { 
        $('.list-group').append(" <a href='#' onclick='selectCard(\"elem" + (i+2).toString() + "\")' class='list-group-item list-group-item-action flex-column align-items-start elem" + (i+2).toString() + "'>" + 
                                "<div class='d-flex w-100 justify-content-between'>" +
                                "<h5 class='mb-1'>" + title + "</h5>" +
                                "<span class='badge badge-primary badge-pill'>" + number + "</span> </div>" +
                                "<p class='mb-1'>" + body + "!</p></a>");
    }
      
    //});
  
});


function selectCard(elemNumber) {
  // Select all list items 
  listItems = $(".list-group-item"); 
  console.log(listItems);
    
  // Remove 'active' tag for all list items 
  for (let i = 0; i < listItems.length; i++) { 
      listItems[i].classList.remove("active"); 
  } 
   
  console.log(elemNumber);
  var element = document.querySelector("." + elemNumber) //.getElementById(elemNumber);
  console.log(element);

  // Add 'active' tag for currently selected item 
  element.classList.add("active"); 
};


