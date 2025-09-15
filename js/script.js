const API_KEY = "989b891a6354e997c04cb5cdfb340bf6";

const searchForm = document.getElementById("search-form");

let cityName;

window.onload = () => {
  fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .then((data) => {
      cityName = data.city;

      fetchWeather(cityName);
    });
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formData = new FormData(searchForm);

  const searchCity = formData.get("search");

  if (searchCity) {
    cityName = searchCity;
    document.getElementById("main").innerHTML = `<div id="loader"></div>`;
    fetchWeather(cityName);
  }
  searchForm.reset();
});

function fetchWeather(city) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      const cityNameRu = data[0].local_names.ru;
      const lat = data[0].lat;
      const lon = data[0].lon;

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          const city = cityNameRu;
          let h1 = document.getElementById("city-name");
          h1.innerText = city;
          h1.classList.add("city-name");

          const main = document.getElementById("main");
          main.innerHTML = `
            <div class='weather-cards'></div>
          `;

          for (let i = 0; i < data.list.length; i++) {
            const forecast = data.list[i];
            console.log(forecast);

            const date = forecast.dt_txt;
            const objDate = new Date(date);
            const temp = forecast.main.temp.toFixed(1);
            const description = forecast.weather[0].description;

            document.querySelector(".weather-cards").innerHTML += `
              <div class='weather-card'>
                <p>${objDate.toLocaleDateString("ru-RU", {
                  weekday: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</p>
                <p>${temp}°</p>
                <p>${description}</p>
              </div>
            `;
          }
        });
    });
}

const searchInput = document.getElementById("search-input");

const suggestions = document.getElementById("suggestions");

const cities = document.getElementsByClassName("cities");

searchInput.addEventListener("input", (event) => {
  suggestions.style.display = "block";
  const value = event.target.value.toLowerCase();

  for (let city of cities) {
    const isVisible = city.textContent.toLowerCase().includes(value);
    city.classList.toggle("show", isVisible);

    city.addEventListener("click", () => {
      searchInput.value = city.textContent;
    });
  }
});

window.onclick = () => {
  suggestions.style.display = "none";
};
