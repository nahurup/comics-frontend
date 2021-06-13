let current_page = 1;
let container = document.getElementById("content-container");
let comic_title;
let title = document.getElementById("title");
let header_button = document.getElementById("header-button");

let api_url = "https://nahurup-comics-api.herokuapp.com";

function mostrarIssuePagination(name_url, issue_number, max_issues) {
    let btn_next = document.getElementById("btn_issue_next");
    let btn_prev = document.getElementById("btn_issue_prev");
    let page_span = document.getElementById("issue_page");

    page_span.innerHTML= issue_number+"/"+max_issues;
    page_span.style.visibility = "visible";

    if (issue_number == 1) {
        btn_prev.style.visibility = "hidden";
        btn_next.style.visibility = "visible";
        btn_next.onclick = function(event) {
            mostrarIssue(name_url, issue_number+1, max_issues);
        }
    }else if (issue_number > 1 && issue_number < max_issues) {
        btn_prev.style.visibility = "visible";
        btn_next.style.visibility = "visible";
        btn_prev.onclick = function(event) {
            mostrarIssue(issue_number-1);
        }
        btn_next.onclick = function(event) {
            mostrarIssue(name_url, issue_number+1, max_issues);
        }
    }else if (issue_number == max_issues) {
        btn_prev.style.visibility = "visible";
        btn_next.style.visibility = "hidden";
        btn_prev.onclick = function(event) {
            mostrarIssue(name_url, issue_number-1, max_issues);
        }
    }
}

function botonMostrarComic(name_url) {
    title.innerHTML = "ReadComics";

    mostrarComic(name_url);
}

function mostrarIssue(name_url, issue_number, max_issues) {
    fetch(api_url+'/comic/'+name_url+'/'+issue_number)
    .then((response) => response.json())
    .then((data) => {
        container.innerHTML = "";
        title.innerHTML = comic_title+" | #"+issue_number;
        header_button.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon>`;
        header_button.onclick = function() {
            botonMostrarComic(name_url);
        };

        for (let i = 0; i < data.length; i++) {
            container.innerHTML += `
                <ion-img
                src="${data[i]}"
                ></ion-img>
            `;
        }

        container.innerHTML += `
            <div class="center">
                <ion-button id="btn_issue_prev" style="visibility: hidden;" color="light">
                    <ion-icon name="caret-back-outline"></ion-icon>
                </ion-icon></ion-button>
                <ion-button id="issue_page" style="visibility: hidden;" color="secondary" href="#"></ion-button>
                <ion-button id="btn_issue_next" style="visibility: hidden;" color="light">
                    <ion-icon name="caret-forward-outline"></ion-icon>
                </ion-button>
            </div>
        `;

        mostrarIssuePagination(name_url, issue_number, max_issues);
    });
}

function fillIssuesList(name_url, max_issues) {
    let issues_list;
    issues_list = document.getElementById("issues-list");


    fetch(api_url+'/comic/issues_list/'+name_url)
    .then((response) => response.json())
    .then((data) => {
        for (let i = 0; i < data.length; i++) {   
            issues_list.innerHTML += `
            <ion-item onclick=mostrarIssue("${name_url}","${data[i].issue_number}","${max_issues}")>
                <ion-label>${data[i].name}</ion-label>
            </ion-item>
            `;
        }
    });

}

function fillComicInfo(name_url) {
    fetch(api_url+'/comic/info/'+name_url)
    .then((response) => response.json())
    .then((data) => {
        comic_title = data.title;
        container.innerHTML += `
        <ion-card>
        <ion-card-header>
            <ion-card-title>${data.title}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
            <ion-item>
                <ion-thumbnail slot="start">
                    <ion-img src="https://readcomicsonline.ru/uploads/manga/${name_url}/cover/cover_250x350.jpg"></ion-img>
                </ion-thumbnail>
                <ion-list slot="end">
                    <ion-card-subtitle>Status: ${data.status}</ion-card-subtitle>
                    <br>
                    <ion-card-subtitle>Date: ${data.date}</ion-card-subtitle>
                    <br>
                    <ion-card-subtitle>Views: ${data.views}</ion-card-subtitle>
                    <br>
                    <ion-card-subtitle>Rating: ${data.rating}</ion-card-subtitle>
                </ion-list>
            </ion-item>

            <!-- List of Text Items -->
            <ion-list>
                <ion-list-header>Issues:</ion-list-header>

                <div id="issues-list">
                </div>
            </ion-list>
        </ion-card-content>
        </ion-card>
        `;

        fillIssuesList(name_url, data.max_issues);
    });
}

function botonVolverPagina(page) {
    container.innerHTML = `
    <ion-grid>
    <ion-row id="comics-list">

    </ion-row>

    <div class="center">
        <ion-button id="btn_prev" style="visibility: hidden;" color="light">
            <ion-icon name="caret-back-outline"></ion-icon>
        </ion-icon></ion-button>
        <ion-button id="page" style="visibility: hidden;" color="tertiary" href="#"></ion-button>
        <ion-button id="btn_next" style="visibility: hidden;" color="light">
            <ion-icon name="caret-forward-outline"></ion-icon>
        </ion-button>
    </div>
    </ion-grid>
    `;

    header_button.innerHTML = `<ion-icon name="book-outline"></ion-icon>`;
    header_button.onclick = null;

    changePage(current_page);
}

function mostrarComic(name_url) {
    container.innerHTML = "";
    header_button.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon>`;
    header_button.onclick = function() {
        botonVolverPagina(current_page);
    };

    fillComicInfo(name_url);
}

function fillList(data, listing_comics) {
    for (let i = 0; i < data.length; i++) {
        listing_comics.innerHTML += 
        '<ion-card onclick=mostrarComic("'+data[i].name_url+'") class="comic-card">\n'+
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

    fetch(api_url+'/pages_number')
    .then((response) => response.json())
    .then((responseJSON) => {
        // Validate page
        if (page < 1) page = 1;
        if (page > responseJSON) page = responseJSON;

        listing_comics.innerHTML = "";

        fetch(api_url+"/page/" +page)
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

        current_page = page;

        container.style.visibility = "visible";
    });
}

function numPages() {
    return fetch(api_url+'/pages_number')
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
