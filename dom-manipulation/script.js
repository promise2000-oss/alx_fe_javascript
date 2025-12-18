// --------------------
// INITIAL DATA SETUP
// --------------------
const defaultQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Learning never exhausts the mind.", category: "Education" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

let quotes = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;

// --------------------
// STORAGE FUNCTIONS
// --------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --------------------
// DISPLAY QUOTES
// --------------------
function displayRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById("quoteDisplay").textContent =
    `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// --------------------
// ADD NEW QUOTE
// --------------------
document.getElementById("addQuoteBtn").addEventListener("click", () => {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  displayRandomQuote();

  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";
});

// --------------------
// JSON EXPORT
// --------------------
document.getElementById("exportBtn").addEventListener("click", () => {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
});

// --------------------
// JSON IMPORT
// --------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      displayRandomQuote();

      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// --------------------
// APP INITIALIZATION
// --------------------
(function init() {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");

  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").textContent =
      `"${quote.text}" — ${quote.category}`;
  } else {
    displayRandomQuote();
  }
})();
// --------------------
// INITIAL DATA SETUP
// --------------------
const defaultQuote = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Learning never exhausts the mind.", category: "Education" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

let quote = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;

// --------------------
// STORAGE FUNCTIONS
// --------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --------------------
// DISPLAY QUOTES
// --------------------
function displayRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById("quoteDisplay").textContent =
    `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// --------------------
// ADD NEW QUOTE
// --------------------
document.getElementById("addQuoteBtn").addEventListener("click", () => {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  displayRandomQuote();

  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";
});

// --------------------
// JSON EXPORT
// --------------------
document.getElementById("exportBtn").addEventListener("click", () => {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
});

// --------------------
// JSON IMPORT
// --------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      displayRandomQuote();

      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// --------------------
// APP INITIALIZATION
// --------------------
(function init() {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");

  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").textContent =
      `"${quote.text}" — ${quote.category}`;
  } else {
    displayRandomQuote();
  }
})();
