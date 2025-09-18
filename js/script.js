const API_KEY = "989b891a6354e997c04cb5cdfb340bf6";

const searchForm = document.getElementById("search-form");

let cityName;

const container = document.querySelector(".main");
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
  container.classList.toggle("collapsed");

  if (container.classList.contains("collapsed")) {
    toggleBtn.textContent = "Показать всё";
  } else {
    toggleBtn.remove();
  }
});

window.onload = () => {
  fetch("https://ipwho.is/").then((res) =>
    res.json().then((data) => {
      cityName = data.city;
      fetchWeather(cityName);
    })
  );
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formData = new FormData(searchForm);

  const searchCity = formData.get("search");

  if (searchCity) {
    toggleBtn.style.display = "none";
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

            let d = (description || "").toLowerCase();
            let descIcon = d.includes("торнадо")
              ? "🌪️"
              : (d.includes("бур") &&
                  (d.includes("пыл") || d.includes("пес"))) ||
                d.includes("пыльная") ||
                d.includes("песчаная")
              ? "🌪️"
              : d.includes("шкв")
              ? "🌬️"
              : d.includes("вулкан")
              ? "🌋"
              : d.includes("гроза")
              ? "⛈️"
              : d.includes("морось")
              ? "🌦️"
              : (d.includes("дожд") && d.includes("снег")) ||
                d.includes("дождь со снегом") ||
                d.includes("дождь и снег")
              ? "🌨️"
              : d.includes("ледяной")
              ? "🧊"
              : d.includes("ливн") || d.includes("ливень")
              ? "🌧️"
              : d.includes("дожд")
              ? "🌧️"
              : d.includes("мокрый") && d.includes("снег")
              ? "🌨️"
              : d.includes("снег") ||
                d.includes("снеж") ||
                d.includes("снегопад")
              ? "❄️"
              : d.includes("туман") ||
                d.includes("дымк") ||
                d.includes("мгла") ||
                d.includes("туманность") ||
                d.includes("дым")
              ? "🌫️"
              : d.includes("пыл") ||
                d.includes("песок") ||
                d.includes("пылевые") ||
                d.includes("песчан")
              ? "🌫️"
              : d.includes("обла") ||
                d.includes("пасмур") ||
                d.includes("облач")
              ? "☁️"
              : d.includes("ясно")
              ? "☀️"
              : "🌍";

            document.querySelector(".weather-cards").innerHTML += `
              <div class='weather-card'>
              <div class="desc-group">
              <p class="desc">${description}</p><p class="desc-icon">${descIcon}</p>
              </div>
              <p class="${temp >= 20 ? "red" : "blue"}">${temp}°C</p>
              <p class="date">${objDate.toLocaleDateString("ru-RU", {
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}</p>
              </div>
            `;
            toggleBtn.style.display = "block";
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
      searchInput.focus();
    });
  }
});

window.onclick = () => {
  suggestions.style.display = "none";
};
