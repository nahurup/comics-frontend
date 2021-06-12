let api_url = "http://nahurup-comics-api.herokuapp.com";

function getSearch(words) {
  fetch(api_url + "/search/" + words)
    .then((response) => response.json())
    .then((data) => {});
}
