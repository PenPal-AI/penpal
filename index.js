window.onload = () => {
  //  Listener to cache text on changes
  quill.on("text-change", () => {
    var text = quill.getText();
    localStorage.setItem("text", text);
  });

  // Get cached text and set text editor contents
  var savedText = localStorage.getItem("text") || "";
  quill.setText(savedText);
};
