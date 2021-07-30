const toggle_checkbox = document.querySelector("#toggle_checkbox");
const displayLocalStorageKey = "DARK_MODE";

if (localStorage.getItem(displayLocalStorageKey) === null) {
  localStorage.setItem(displayLocalStorageKey, "light");
} else {
  if (localStorage.getItem(displayLocalStorageKey) == "dark") {
    toDark();
  }
}

toggle_checkbox.addEventListener("click", function () {
  toDark();
  switchDisplay();
});

function toDark() {
  toggle_checkbox.classList.toggle("light-button");
  if (toggle_checkbox.innerHTML != "Light Mode") {
    toggle_checkbox.innerHTML = "Light Mode";
  } else {
    toggle_checkbox.innerHTML = "Dark Mode";
  }
  document.querySelector("body").classList.toggle("body-dark");
  document.querySelector("header").classList.toggle("head_bar-dark");
  document.querySelector("#bookSubmit").classList.toggle("head_bar-dark");
  document.querySelector("#searchSubmit").classList.toggle("head_bar-dark");
}

// Title
const title = document.querySelector("#inputBookTitle");
const errorTitle = document.querySelector("#errorTitle");
const sectionTitle = document.querySelector("#sectionTitle");
// Author
const author = document.querySelector("#inputBookAuthor");
const errorAuthor = document.querySelector("#errorAuthor");
const sectionAuthor = document.querySelector("#sectionAuthor");
// Book
const year = document.querySelector("#inputBookYear");
const errorYear = document.querySelector("#errorYear");
const sectionYear = document.querySelector("#sectionYear");
// Button
const button_submit = document.querySelector("#bookSubmit");
const button_search = document.querySelector("#searchSubmit");

const finished = document.querySelector("#inputBookIsComplete");
const searchValue = document.querySelector("#searchBookTitle");
const localStorageKey = "BOOKSHELF";

let valid_input = [];
let valid_title = null;
let valid_author = null;
let valid_year = null;

window.addEventListener("load", function () {
  if (localStorage.getItem(localStorageKey) !== null) {
    const booksData = getData();
    showData(booksData);
  }
});

button_submit.addEventListener("click", function () {
  if (button_submit.value == "") {
    valid_input = [];

    title.classList.remove("error");
    author.classList.remove("error");
    year.classList.remove("error");

    errorTitle.classList.add("error-display");
    errorAuthor.classList.add("error-display");
    errorYear.classList.add("error-display");

    if (title.value == "") {
      valid_title = false;
    } else {
      valid_title = true;
    }

    if (author.value == "") {
      valid_author = false;
    } else {
      valid_author = true;
    }

    if (year.value == "") {
      valid_year = false;
    } else {
      valid_year = true;
    }

    valid_input.push(valid_title, valid_author, valid_year);
    let resultCheck = validation(valid_input);

    if (resultCheck.includes(false)) {
      return false;
    } else {
      const newBook = {
        id: +new Date(),
        title: title.value.trim(),
        author: author.value.trim(),
        year: year.value,
        isCompleted: finished.checked,
      };
      insertData(newBook);
      alert(`Buku berhasil ditambahkan`);

      title.value = "";
      author.value = "";
      year.value = "";
      finished.checked = false;
    }
  } else {
    const bookData = getData().filter((a) => a.id != button_submit.value);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    const newBook = {
      id: button_submit.value,
      title: title.value.trim(),
      author: author.value.trim(),
      year: year.value,
      isCompleted: finished.checked,
    };
    insertData(newBook);
    button_submit.innerHTML = "Masukkan Buku";
    button_submit.value = "";
    title.value = "";
    author.value = "";
    year.value = "";
    finished.checked = false;
    alert("Buku berhasil diedit");
  }
});

function getData() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}

function validation(check) {
  let resultCheck = [];

  check.forEach((a, i) => {
    if (a == false) {
      if (i == 0) {
        title.classList.add("error");
        errorTitle.classList.remove("error-display");
        resultCheck.push(false);
      } else if (i == 1) {
        author.classList.add("error");
        errorAuthor.classList.remove("error-display");
        resultCheck.push(false);
      } else {
        year.classList.add("error");
        errorYear.classList.remove("error-display");
        resultCheck.push(false);
      }
    }
  });

  return resultCheck;
}

function insertData(book) {
  let bookData = [];

  if (localStorage.getItem(localStorageKey) === null) {
    localStorage.setItem(localStorageKey, 0);
  } else {
    bookData = JSON.parse(localStorage.getItem(localStorageKey));
  }

  bookData.unshift(book);
  localStorage.setItem(localStorageKey, JSON.stringify(bookData));

  showData(getData());
}

button_search.addEventListener("click", function (e) {
  e.preventDefault();
  if (localStorage.getItem(localStorageKey) == null) {
    return alert("Tidak ada data buku");
  } else {
    const getByTitle = getData().filter((a) => a.title == searchValue.value.trim());
    if (getByTitle.length == 0) {
      const getByAuthor = getData().filter((a) => a.author == searchValue.value.trim());
      if (getByAuthor.length == 0) {
        const getByYear = getData().filter((a) => a.year == searchValue.value.trim());
        if (getByYear.length == 0) {
          alert(`Tidak ada data buku dengan kata kunci: ${searchValue.value}`);
        } else {
          hasil_pencarian(getByYear);
        }
      } else {
        hasil_pencarian(getByAuthor);
      }
    } else {
      hasil_pencarian(getByTitle);
    }
  }

  searchValue.value = "";
});

function showData(books = []) {
  const inCompleted = document.querySelector("#incompleteBookshelfList");
  const completed = document.querySelector("#completeBookshelfList");

  inCompleted.innerHTML = "";
  completed.innerHTML = "";

  books.forEach((book) => {
    if (book.isCompleted == false) {
      let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>
                <div class="action">
                    <button class="green" onclick="finished_reading('${book.id}')">Selesai dibaca</button>
                    <button class="yellow" onclick="edit_buku('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="hapus_buku('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;

      inCompleted.innerHTML += el;
    } else {
      let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>
                <div class="action">
                    <button class="green" onclick="unfinished_reading('${book.id}')">Belum selesai di Baca</button>
                    <button class="yellow" onclick="edit_buku('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="hapus_buku('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;
      completed.innerHTML += el;
    }
  });
}

function hasil_pencarian(books) {
  const searchResult = document.querySelector("#searchResult");

  searchResult.innerHTML = "";

  books.forEach((book) => {
    let el = `
        <article class="book_item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <p>${book.isCompleted ? "Sudah dibaca" : "Belum dibaca"}</p>
        </article>
        `;

    searchResult.innerHTML += el;
  });
}

function finished_reading(id) {
  if (confirm("Pindahkan ke selesai dibaca?")) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: bookDataDetail[0].id,
      title: bookDataDetail[0].title,
      author: bookDataDetail[0].author,
      year: bookDataDetail[0].year,
      isCompleted: true,
    };

    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    insertData(newBook);
  } else {
    return 0;
  }
}

function unfinished_reading(id) {
  if (confirm("Pindahkan ke belum selesai dibaca?")) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: bookDataDetail[0].id,
      title: bookDataDetail[0].title,
      author: bookDataDetail[0].author,
      year: bookDataDetail[0].year,
      isCompleted: false,
    };

    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    insertData(newBook);
  } else {
    return 0;
  }
}

function edit_buku(id) {
  const bookDataDetail = getData().filter((a) => a.id == id);
  title.value = bookDataDetail[0].title;
  author.value = bookDataDetail[0].author;
  year.value = bookDataDetail[0].year;
  bookDataDetail[0].isCompleted ? (finished.checked = true) : (finished.checked = false);

  button_submit.innerHTML = "Edit buku";
  button_submit.value = bookDataDetail[0].id;
}

function hapus_buku(id) {
  if (confirm("Apakah Anda akan menghapus data?")) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));
    showData(getData());
    alert(`Buku ${bookDataDetail[0].title} telah terhapus`);
  } else {
    return 0;
  }
}
