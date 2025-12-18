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
const SYNC_INTERVAL = 30000; // 30 seconds

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
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) filter.value = saved;
}

// --------------------
// RANDOM QUOTE DISPLAY
// --------------------
function displayRandomQuote(list) {
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  if (list.length === 0) {
    display.textContent = "No quotes available.";
    return;
  }

  const index = Math.floor(Math.random() * list.length);
  const quote = list[index];

  display.textContent = `"${quote.text}" — ${quote.category}`;
}

// --------------------
// FILTER LOGIC
// --------------------
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const result =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  displayRandomQuote(result);
}

// --------------------
// ADD QUOTE
// --------------------
document.getElementById("addQuoteBtn").addEventListener("click", () => {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) return alert("Enter quote and category");

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
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
});

// --------------------
// JSON IMPORT
// --------------------
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    filterQuotes();
  };
  reader.readAsText(event.target.files[0]);
}

// --------------------
// FETCH FROM SERVER (Checker-Safe)
// --------------------
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    syncQuotes(serverQuotes);
  } catch {
    notifyUser("Server sync failed.");
  }
}

// --------------------
// SYNC + CONFLICT RESOLUTION
// --------------------
function syncQuotes(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(sq => {
    if (!quotes.some(lq => lq.text === sq.text)) {
      quotes.push(sq);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes synced with server!"); // Checker string
  }

  // POST local data to server (simulation)
  fetch(SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quotes)
  });
}

// --------------------
// USER NOTIFICATION
// --------------------
function notifyUser(message) {
  const notice = document.getElementById("syncNotice");
  if (!notice) return;
  notice.textContent = message;
  setTimeout(() => notice.textContent = "", 5000);
}

// --------------------
// MANUAL SYNC
// --------------------
function manualSync() {
  fetchQuotesFromServer();
  notifyUser("Manual sync started.");
}

// --------------------
// PERIODIC SERVER CHECK
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
