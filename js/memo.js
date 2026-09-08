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
const memoModal = document.getElementById("memoModal");
const tagFilterButton = document.getElementById("tagFilterBtn");
const tagDropdown = document.getElementById("tagDropdown");
const selectedTagText = document.getElementById("selectedTagText");
const tagDot = document.getElementById("tagDot");
let selectedTag = "all";

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
  card.addEventListener("click", () => openMemoDetail(memo));
  return card;
}

function openMemoDetail(memo) {
  document.getElementById("modalTitle").textContent = memo.title;
  document.getElementById("modalTag").textContent = memo.category;
  document.getElementById("modalDate").textContent = memo.date;
  document.getElementById("modalBody").textContent = memo.content;
  document.getElementById("modalCard").className = `modal-card card-${memo.category.toLowerCase()}`;
  document.getElementById("modalTagDot").className = `modal-tag-dot dot-${memo.category.toLowerCase()}`;
  memoModal.hidden = false;
  memoModal.classList.add("active");
}

function closeMemoDetail() {
  memoModal.classList.remove("active");
  memoModal.hidden = true;
}

function renderSearchResults() {
  const query = searchInput.value.trim().toLowerCase();
  memoGrid.replaceChildren();
  const results = memoList
    .filter((memo) => {
      const matchesTag = selectedTag === "all" || memo.category === selectedTag;
      const matchesQuery = !query || `${memo.title} ${memo.content} ${memo.category}`.toLowerCase().includes(query);
      return matchesTag && matchesQuery;
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  results.forEach((memo) => memoGrid.appendChild(createCardElement(memo)));
  emptyArea.hidden = results.length > 0 || Boolean(query) || selectedTag !== "all";
  searchEmptyArea.hidden = results.length > 0 || (!query && selectedTag === "all");
}

searchInput.addEventListener("input", renderSearchResults);
searchButton.addEventListener("click", renderSearchResults);
tagFilterButton.addEventListener("click", () => tagDropdown.classList.toggle("show"));
tagDropdown.addEventListener("click", (event) => {
  const option = event.target.closest("li");
  if (!option) return;
  selectedTag = option.dataset.tag;
  selectedTagText.textContent = selectedTag === "all" ? "태그 선택" : selectedTag;
  tagDot.className = selectedTag === "all" ? "tag-dot" : `tag-dot show dot-${selectedTag.toLowerCase()}`;
  tagDropdown.classList.remove("show");
  renderSearchResults();
});
document.getElementById("modalCloseBtn").addEventListener("click", closeMemoDetail);
memoModal.addEventListener("click", (event) => {
  if (event.target === memoModal) closeMemoDetail();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !memoModal.hidden) closeMemoDetail();
});

renderSearchResults();
