const STORAGE_KEY = "vanilla-memo-list";
const defaultMemoList = [
  {
    id: "memo-1",
    title: "이것은 제목입니다",
    content: "이것은 본문입니다 이것은 본문입니다 이것은 본문입니다 ...",
    category: "Daily",
    date: "2026.09.06",
    pinned: true
  },
  {
    id: "memo-2",
    title: "이것은 제목입니다",
    content: "이것은 본문입니다 이것은 본문입니다 이것은 본문입니다 ...",
    category: "Work",
    date: "2026.09.05",
    pinned: false
  },
  {
    id: "memo-3",
    title: "이것은 제목입니다",
    content: "이것은 본문입니다 이것은 본문입니다 이것은 본문입니다 ...",
    category: "Others",
    date: "2026.09.03",
    pinned: true
  },
  {
    id: "memo-4",
    title: "이것은 제목입니다",
    content: "이것은 본문입니다 이것은 본문입니다 이것은 본문입니다 ...",
    category: "Daily",
    date: "2026.09.01",
    pinned: false
  }
];

function loadMemos() {
  const storedMemos = localStorage.getItem(STORAGE_KEY);
  if (!storedMemos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMemoList));
    return defaultMemoList.map((memo) => ({ ...memo }));
  }

  try {
    const parsedMemos = JSON.parse(storedMemos);
    if (!Array.isArray(parsedMemos)) throw new Error("메모 데이터가 배열이 아닙니다.");
    return parsedMemos;
  } catch (error) {
    console.error("저장된 메모를 불러오지 못했습니다.", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMemoList));
    return defaultMemoList.map((memo) => ({ ...memo }));
  }
}

let memoList = loadMemos();
let activeMemo = null;
const memoGrid = document.getElementById("memoGrid");
const emptyArea = document.querySelector(".empty-area:not(.search-empty-area)");
const searchEmptyArea = document.getElementById("searchEmptyArea");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-submit-btn");
const memoModal = document.getElementById("memoModal");
const addMemoModal = document.getElementById("addMemoModal");
const addMemoForm = document.getElementById("addMemoForm");
const tagFilterButton = document.getElementById("tagFilterBtn");
const tagDropdown = document.getElementById("tagDropdown");
const selectedTagText = document.getElementById("selectedTagText");
const tagDot = document.getElementById("tagDot");
let selectedTag = "all";

function saveMemos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memoList));
}

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
    saveMemos();
    renderSearchResults();
  });
  card.addEventListener("click", () => openMemoDetail(memo));
  return card;
}

function openMemoDetail(memo) {
  activeMemo = memo;
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
  activeMemo = null;
  memoModal.classList.remove("active");
  memoModal.hidden = true;
}

function openAddMemo() {
  addMemoForm.reset();
  addMemoModal.hidden = false;
  addMemoModal.classList.add("active");
  document.getElementById("newMemoTitle").focus();
}

function closeAddMemo() {
  addMemoModal.classList.remove("active");
  addMemoModal.hidden = true;
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
document.querySelector(".add-btn").addEventListener("click", openAddMemo);
document.querySelector(".center-add-btn").addEventListener("click", openAddMemo);
document.getElementById("addMemoCloseBtn").addEventListener("click", closeAddMemo);
addMemoModal.addEventListener("click", (event) => {
  if (event.target === addMemoModal) closeAddMemo();
});
addMemoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(addMemoForm);
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const category = String(formData.get("category") || "Others");
  if (!title || !content) return;

  memoList.unshift({
    id: `memo-${Date.now()}`,
    title,
    content,
    category,
    date: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
    pinned: false
  });
  saveMemos();
  searchInput.value = "";
  selectedTag = "all";
  selectedTagText.textContent = "태그 선택";
  tagDot.className = "tag-dot";
  closeAddMemo();
  renderSearchResults();
});
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
document.querySelector('[data-action="edit"]').addEventListener("click", () => {
  if (!activeMemo) return;
  const title = window.prompt("메모 제목을 입력하세요.", activeMemo.title);
  if (title === null) return;
  const content = window.prompt("메모 내용을 입력하세요.", activeMemo.content);
  if (content === null) return;
  activeMemo.title = title.trim() || activeMemo.title;
  activeMemo.content = content.trim() || activeMemo.content;
  saveMemos();
  closeMemoDetail();
  renderSearchResults();
});
document.querySelector('[data-action="delete"]').addEventListener("click", () => {
  if (!activeMemo || !window.confirm("이 메모를 삭제할까요?")) return;
  memoList = memoList.filter((memo) => memo.id !== activeMemo.id);
  saveMemos();
  closeMemoDetail();
  renderSearchResults();
});
memoModal.addEventListener("click", (event) => {
  if (event.target === memoModal) closeMemoDetail();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !memoModal.hidden) closeMemoDetail();
  if (event.key === "Escape" && !addMemoModal.hidden) closeAddMemo();
});

renderSearchResults();
