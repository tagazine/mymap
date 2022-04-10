// Set Global Variables and Obtain User Location
var myMap;
var lat;
var long;

async function getCoords() {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return pos;
}

// Initialize map
window.onload = async () => {
  const coords = await getCoords();
  myMap = await L.map("map").setView(
    [coords.coords.latitude, coords.coords.longitude],
    5
  );
  lat = coords.coords.latitude;
  long = coords.coords.longitude;
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: "15",
  }).addTo(myMap);
  var myIcon = L.icon({
    iconUrl: "./assets/14444838041553668337-128.png",
    iconSize: [30, 30],
  });

  const home = L.marker([coords.coords.latitude, coords.coords.longitude], {
    icon: myIcon,
  });
  home
    .addTo(myMap)
    .bindPopup(`<b>I SEE YOU</b><br>Latitude: ${lat}<br>Longitude: ${long}`)
    .openPopup();
};

// FourSquare API - Five Nearest Locations (specific business type)
async function findShops(query, myIcon) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "fsq3K6q1Du/TGZcRMy89m4EY6mZFfWhiYk7rzqzcBKZQDJw=",
    },
  };
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat}%2C${long}&limit=5`,
    options
  );
  const data = await response.text();
  let parseData = JSON.parse(data);
  let businesses = parseData.results;
  console.log(businesses);
  businesses.forEach((business) => {
    let marker = L.marker([
      business.geocodes.main.latitude,
      business.geocodes.main.longitude,
    ], {icon: myIcon});
    marker
      .addTo(myMap)
      .bindPopup(`<b>${business.name}</b><br>${business.location.address}`)
      .openPopup();
  });
}

// Select Interface
function hotSpots() {
  let place = document.querySelector("#business");
  if (place.value === "coffee") {
    var myIcon = L.icon({
      iconUrl: "assets/coffee.png",
      iconSize: [30, 30],
    });
    findShops("coffee", myIcon);
  } else if (place.value === "restaurant") {
    var myIcon = L.icon({
      iconUrl: "assets/restaurant.png.crdownload",
      iconSize: [30, 30],
    });
    findShops("restaurant", myIcon);
  } else if (place.value === "hotel") {
    var myIcon = L.icon({
      iconUrl: "assets/hotel-icon.png",
      iconSize: [30, 30],
    });
    findShops("hotel", myIcon);
  } else if (place.value === "market") {
    var myIcon = L.icon({
      iconUrl: "assets/grocery.png",
      iconSize: [30, 30],
    });
    findShops("grocery", myIcon);
  }
}
