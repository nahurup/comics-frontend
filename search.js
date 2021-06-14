let listing_search = document.getElementById("list-search");
let search_input = document.getElementById("searchQueryInput");
let search_button = document.getElementById("searchQuerySubmit");
let words;
search_button.addEventListener("click", function() {
  search();
});

function search() {
  words = search_input.value;
  if (words.length > 0) {
    getSearch(words);
  } else {
    listing_search.innerHTML = " ";
    listing_search.innerHTML = `
    <ion-card>
      <ion-card-content>
        <ion-card-title>Write something to search for!</ion-card-title>
      </ion-card-content>
    </ion-card>`;
  }
}

function getSearch(words) {
  fetch(api_url + "/search/" + words)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        fillList(data, listing_search);
      } else {
        listing_search.innerHTML = " ";
        listing_search.innerHTML = `
        <ion-card>
          <ion-card-content>
            <ion-card-title>Sorry! we couldn't find any results.</ion-card-title>
          </ion-card-content>
        </ion-card>`;
      }

    });
}

function fillList(data, listing_search) {
  listing_search.innerHTML = " ";
  for (let i = 0; i < data.length; i++) {
    listing_search.innerHTML += `
      <ion-card onclick=mostrarComic("${data[i].name}") class="comic-card">
      <ion-img src="https://readcomicsonline.ru/uploads/manga/${data[i].name}/cover/cover_250x350.jpg"></ion-img>
      <div class="overlay">
          <div class="card-title">
              ${data[i].title}
          </div>
      </div>
      </ion-card>`;
  }
}
