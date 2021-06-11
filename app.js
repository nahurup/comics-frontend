let current_page = 1;
let records_per_page = 3;

let api_url = "https://nahurup-comics-api.herokuapp.com";

function prevPage() {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
  }
}

function nextPage() {
  if (current_page < numPages()) {
    current_page++;
    changePage(current_page);
  }
}

function mostrarComic(name_url) {

}

function fillList(data, listing_comics) {
    for (let i = 0; i < data.length; i++) {
        listing_comics.innerHTML += 
        '<ion-card onclick='+mostrarComic(data[i].name_url)+' class="comic-card">\n'+
            '<ion-img src='+data[i].img_url+'></ion-img>\n' +
            '<div class="overlay">\n' +
                '<div class="card-title">\n' +
                    data[i].name
                '</div>\n' +
            '</div>\n' +
        '</ion-card>';
    }
}

function changePage(page) {
  let btn_next = document.getElementById("btn_next");
  let btn_prev = document.getElementById("btn_prev");
  let listing_comics = document.getElementById("comics-list");
  let page_span = document.getElementById("page");

  comics_list = 0;

  fetch('https://nahurup-comics-api.herokuapp.com/pages_number')
  .then((response) => response.json())
  .then((responseJSON) => {
        // Validate page
        if (page < 1) page = 1;
        if (page > responseJSON) page = responseJSON;

        listing_comics.innerHTML = "";

        fetch("https://nahurup-comics-api.herokuapp.com/page/" +page)
        .then(response => response.json())
        .then(data => (fillList(data, listing_comics)))
        .catch(error => console.log(error))

        page_span.innerHTML = page + "/" + responseJSON;
        page_span.style.visibility = "visible";

        if (page == 1) {
            btn_prev.style.visibility = "hidden";
            btn_next.style.visibility = "visible";
            btn_next.onclick = function(event) {
                changePage(page+1);
            }
        }else if (page > 1 && page < responseJSON) {
            btn_prev.style.visibility = "visible";
            btn_next.style.visibility = "visible";
            btn_prev.onclick = function(event) {
                changePage(page-1);
            }
            btn_next.onclick = function(event) {
                changePage(page+1);
            }
        }else if (page == responseJSON) {
            btn_prev.style.visibility = "visible";
            btn_next.style.visibility = "hidden";
            btn_prev.onclick = function(event) {
                changePage(page-1);
            }
        }
  });


}

function numPages() {
    return fetch('https://nahurup-comics-api.herokuapp.com/pages_number')
    .then((response) => { 
        return response.json().then((data) => {
            console.log(data);
            return data;
        }).catch((err) => {
            console.log(err);
        }) 
    });
}

window.onload = function () {
  changePage(1);
};
