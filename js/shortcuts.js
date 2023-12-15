document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchFor();
    }
  });
  document.addEventListener("keyup", function (event) {
    if (event.ctrlKey && event.key === "/") {
      let search = document.getElementById("search");
      search.focus();
    }
  });