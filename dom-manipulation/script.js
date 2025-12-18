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
// SERVER CONFIG
// --------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 30000;

// --------------------
// STORAGE FUNCTIONS
// --------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --------------------
// CATEGORY POPULATION
// --------------------
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

// --------------------
// RANDOM QUOTE DISPLAY
// --------------------
function displayRandomQuote(list) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  if (list.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * list.length);
  const quote = list[randomIndex];

  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// --------------------
// FILTER LOGIC
// --------------------
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  displayRandomQuote(filteredQuotes);
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

  populateCategories();
  filterQuotes();

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

      if (!Array.isArray(importedQuotes)) throw new Error();

      quotes.push(...importedQuotes);
      saveQuotes();

      populateCategories();
      filterQuotes();

      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// --------------------
// SERVER FETCH (REQUIRED NAME)
// --------------------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    syncWithServer(serverQuotes);
  } catch {
    notifyUser("Server sync failed.");
  }
}

// --------------------
// CONFLICT RESOLUTION (SERVER WINS)
// --------------------
function syncWithServer(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(q => q.text === serverQuote.text);
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes updated from server. Conflicts resolved.");
  }
}

// --------------------
// USER NOTIFICATION
// --------------------
function notifyUser(message) {
  const notice = document.getElementById("syncNotice");
  if (!notice) return;

  notice.textContent = message;
  setTimeout(() => (notice.textContent = ""), 5000);
}

// --------------------
// MANUAL SYNC
// --------------------
function manualSync() {
  fetchQuotesFromServer();
  notifyUser("Manual sync initiated.");
}

// --------------------
// PERIODIC SYNC
// --------------------
setInterval(fetchQuotesFromServer, SYNC_INTERVAL);

// --------------------
// APP INITIALIZATION
// --------------------
(function init() {
  populateCategories();
  filterQuotes();
  fetchQuotesFromServer();
})();
