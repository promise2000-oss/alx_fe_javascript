// ============================
// Data Store
// ============================
const quotes = [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Technology" },
  { text: "Simplicity is the soul of efficiency.", category: "Technology" },
  { text: "Believe you can and you're halfway there.", category: "Motivation" }
];

// ============================
// DOM References
// ============================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryContainer = document.getElementById("categoryContainer");
const formContainer = document.getElementById("formContainer");

// ============================
// Utility Functions
// ============================
function getUniqueCategories() {
  return [...new Set(quotes.map(q => q.category))];
}

// ============================
// Quote Display Logic
// ============================
function showRandomQuote() {
  const selectedCategory = document.querySelector("select")?.value;
  const filteredQuotes = selectedCategory
    ? quotes.filter(q => q.category === selectedCategory)
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}"`;
}

// ============================
// Category Selector Creation
// ============================
function createCategorySelector() {
  categoryContainer.innerHTML = "";

  const select = document.createElement("select");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All Categories";
  select.appendChild(defaultOption);

  getUniqueCategories().forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  select.addEventListener("change", showRandomQuote);
  categoryContainer.appendChild(select);
}

// ============================
// Add Quote Form Creation
// ============================
function createAddQuoteForm() {
  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// ============================
// Add Quote Logic
// ============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both quote and category are required.");
    return;
  }

  quotes.push({ text, category });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  createCategorySelector();
  showRandomQuote();
}

// ============================
// Event Bindings
// ============================
newQuoteBtn.addEventListener("click", showRandomQuote);

// ============================
// Initial Render
// ============================
createCategorySelector();
createAddQuoteForm();
showRandomQuote();
