window.onload = () => {
  //  Listener to cache text on changes
  quill.on("text-change", () => {
    var text = quill.getSemanticHTML();
    console.log(text);
    localStorage.setItem("text", text);
  });

  //   Load cached text and set text editor contents
  var cachedText = localStorage.getItem("text") || "";
  quill.clipboard.dangerouslyPasteHTML(cachedText);
};
