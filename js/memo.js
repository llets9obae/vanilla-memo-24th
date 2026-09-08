const memoList = [];

const memoGrid = document.getElementById("memoGrid");
const emptyArea = document.querySelector(".empty-area:not(.search-empty-area)");
const searchEmptyArea = document.getElementById("searchEmptyArea");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-submit-btn");

function createCardElement(memo) {
  const card = document.createElement("article");
  card.className = `memo-card card-${memo.category.toLowerCase()}`;
  card.innerHTML = `
    <div class="card-header"><h2 class="card-title">${memo.title}</h2></div>
    <p class="card-content">${memo.content}</p>
    <div class="card-footer">
      <span class="category-name">${memo.category}</span>
      <time class="card-date">${memo.date}</time>
    </div>
  `;
  return card;
}

function renderSearchResults() {
  const query = searchInput.value.trim().toLowerCase();
  memoGrid.replaceChildren();

  if (!query) {
    emptyArea.hidden = false;
    searchEmptyArea.hidden = true;
    return;
  }

  const results = memoList.filter((memo) =>
    `${memo.title} ${memo.content} ${memo.category}`.toLowerCase().includes(query)
  );

  results.forEach((memo) => memoGrid.appendChild(createCardElement(memo)));
  emptyArea.hidden = true;
  searchEmptyArea.hidden = results.length > 0;
}

searchInput.addEventListener("input", renderSearchResults);
searchButton.addEventListener("click", renderSearchResults);
