const memoList = [
  {
    title: "이것은 제목입니다",
    content: "이것은 본문입니다 이것은 본문입니다 이것은 본문입니다 ...",
    category: "Daily",
    date: "2026.09.06",
    pinned: true
  },
  {
    title: "이것은 제목입니다",
    content: "이것은 본문입니다 이것은 본문입니다 이것은 본문입니다 ...",
    category: "Work",
    date: "2026.09.05",
    pinned: false
  },
  {
    title: "이것은 제목입니다",
    content: "이것은 본문입니다 이것은 본문입니다 이것은 본문입니다 ...",
    category: "Others",
    date: "2026.09.03",
    pinned: true
  },
  {
    title: "이것은 제목입니다",
    content: "이것은 본문입니다 이것은 본문입니다 이것은 본문입니다 ...",
    category: "Daily",
    date: "2026.09.01",
    pinned: false
  }
];

const memoGrid = document.getElementById("memoGrid");
const emptyArea = document.querySelector(".empty-area:not(.search-empty-area)");
const searchEmptyArea = document.getElementById("searchEmptyArea");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-submit-btn");

function createCardElement(memo) {
  const card = document.createElement("article");
  card.className = `memo-card card-${memo.category.toLowerCase()}`;
  card.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">${memo.title}</h2>
      <button type="button" class="star-btn${memo.pinned ? " pinned" : ""}" aria-label="${memo.pinned ? "메모 고정 해제" : "메모 고정"}" aria-pressed="${memo.pinned}">★</button>
    </div>
    <p class="card-content">${memo.content}</p>
    <div class="card-footer">
      <span class="category-name">${memo.category}</span>
      <time class="card-date">${memo.date}</time>
    </div>
  `;
  card.querySelector(".star-btn").addEventListener("click", (event) => {
    event.stopPropagation();
    memo.pinned = !memo.pinned;
    renderSearchResults();
  });
  return card;
}

function renderSearchResults() {
  const query = searchInput.value.trim().toLowerCase();
  memoGrid.replaceChildren();

  if (!query) {
    memoList
      .slice()
      .sort((a, b) => Number(b.pinned) - Number(a.pinned))
      .forEach((memo) => memoGrid.appendChild(createCardElement(memo)));
    emptyArea.hidden = true;
    searchEmptyArea.hidden = true;
    return;
  }

  const results = memoList
    .filter((memo) => `${memo.title} ${memo.content} ${memo.category}`.toLowerCase().includes(query))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  results.forEach((memo) => memoGrid.appendChild(createCardElement(memo)));
  emptyArea.hidden = true;
  searchEmptyArea.hidden = results.length > 0;
}

searchInput.addEventListener("input", renderSearchResults);
searchButton.addEventListener("click", renderSearchResults);

renderSearchResults();
