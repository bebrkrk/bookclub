const API = "https://script.google.com/macros/s/AKfycbzNtQZV4cyQ1FOugioXWp0lj2KpFBxD6NhmE-kXTD3ASmyEPAQrkDYtod0isZUbZXoytQ/exec";
const page = location.pathname;

if (page.endsWith("/") || page.includes("index")) {
  fetch(`${API}?action=getBooks`)
    .then(r => r.json())
    .then(books => {
      const el = document.getElementById("books");
      books.forEach(b => {
        el.innerHTML += `
          <div class="book" onclick="openBook(${b.id})">
            <img src="${b.cover_url}">
            <div>${b.title}</div>
            <div>⭐ ${b.avgRating ?? "—"}</div>
          </div>
        `;
      });
    });
}

if (page.includes("book")) {
  const id = new URLSearchParams(location.search).get("id");

  fetch(`${API}?action=getBook&book_id=${id}`)
    .then(r => r.json())
    .then(data => {
      document.getElementById("book").innerHTML = `
        <h2>${data.book.title}</h2>
        <img src="${data.book.cover_url}">
      `;
      const r = document.getElementById("reviews");
      data.reviews.forEach(rv => {
        r.innerHTML += `<p><b>${rv.author}</b> ⭐${rv.rating}<br>${rv.text}</p>`;
      });
    });
}

function openBook(id) {
  location.href = `book.html?id=${id}`;
}

function sendReview() {
  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "addReview",
      book_id: new URLSearchParams(location.search).get("id"),
      author: author.value,
      rating: rating.value,
      text: text.value
    })
  }).then(() => location.reload());
}


