const count = 10;
const apiKey = "K9UxihAFk2aCA1cFsWn8FYacxeJj9TCmMmh4fKYR";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

//Refs

const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

async function getNasaData() {
  loader.classList.remove("hidden");
  try {
    resultsArray = await (await fetch(apiUrl)).json();
    updateDOM("results");
  } catch (error) {
    alert(error);
  }
}

function updateDOM(flag) {
  let arr = [];
  let content = "";
  imagesContainer.textContent = "";
  if (flag == "favorites") {
    arr = Object.values(JSON.parse(localStorage.getItem("nasa-favorites")));
  } else {
    arr = resultsArray;
  }
  if (arr == undefined || arr.length == 0) {
    alert("Favorites are empty");
    // getNasaData();
    // // return;
    // document.body.setHTML(
    //   `<h3>No Favorites marked</h3><div><button onclick='${getNasaData(
    //     "results"
    //   )}'>Go back</button></div>`
    // );
  }
  arr.forEach((each, i) => {
    let html = `<div class='add'>
    <a href='${each.hdurl}' title='View full Image' target='_blank'>
    <img class='card-img-top' src='${
      each.url
    }' alt='NASA Picture of the day' loading='lazy'>
    </a>
    <div class='card-body'>
    <h5 class='card-title'>${each.title}</h5>
    <p class="add-to-fav" id='${i}'>
   ${flag == "favorites" ? "Remove from" : "Add to"} Favorites</p>
                    <p class="card-text">${each.explanation}</p>
                    <small class="text-muted">
                        <strong>${each.date}</strong>
                        <span>&copy;${each.copyright || "NA"}</span>
                    </small>
    </div>
    </div>`;
    content += html;
  });
  imagesContainer.setHTML(content);
  arr.forEach((each, i) => {
    if (flag !== "favorites") {
      document.getElementById(i).onclick = () => {
        saveFavorite(each);
      };
    } else {
      document.getElementById(i).onclick = () => {
        removeFavorite(each);
      };
    }
    // document
    //   .getElementById(i)
    //   .setAttribute("onclick", `saveFavorite('${each.url}')`);
  });
  if (flag == "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  loader.classList.add("hidden");
}

function saveFavorite(each) {
  if (!favorites[each.title]) {
    favorites[each.title] = each;
    localStorage.setItem("nasa-favorites", JSON.stringify(favorites));
    saveConfirmed.classList.remove("hidden");
    setTimeout(() => {
      saveConfirmed.classList.add("hidden");
    }, 2000);
  }
}

function removeFavorite(each) {
  let localData = JSON.parse(localStorage.getItem("nasa-favorites"));
  delete localData[each.title];
  localStorage.setItem("nasa-favorites", JSON.stringify(localData));
  updateDOM("favorites");
}

getNasaData();
