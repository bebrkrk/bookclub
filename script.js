const API = "https://script.google.com/macros/s/AKfycbyaHZadQR6eXh25Nzl0au8Cg_Rh5Acg8-dTyNM2isf1c7doNNJ5ShNipyhTAaiNn3EIvg/exec";

function login() {
  fetch(`${API}?action=login&nickname=${nick.value}&pin=${pin.value}`)
    .then(r => r.json())
    .then(u => {
      if (!u) return alert("Ошибка");
      localStorage.user = JSON.stringify(u);
      location.href = "catalog.html";
    });
}

if (location.pathname.includes("catalog")) {
  fetch(`${API}?action=getBooks`)
    .then(r => r.json())
    .then(books => {
      books.forEach(b => {
        booksDiv.innerHTML += `
          <div class="book" onclick="openBook(${b.id})">
            <img src="${b.cover_url}">
            <div>${b.title}</div>
          </div>`;
      });
    });
}

function openBook(id) {
  location.href = `book.html?id=${id}`;
}

if (location.pathname.includes("book")) {
  const id = new URLSearchParams(location.search).get("id");
  fetch(`${API}?action=getBook&book_id=${id}`)
    .then(r => r.json())
    .then(data => {
      book.innerHTML = `<h2>${data.book.title}</h2><img src="${data.book.cover_url}">`;
    });
}

function sendReview() {
  const user = JSON.parse(localStorage.user);
  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "addReview",
      user_id: user.id,
      book_id: new URLSearchParams(location.search).get("id"),
      text: review.value,
      rating: rating.value
    })
  }).then(() => alert("Сохранено"));
}
