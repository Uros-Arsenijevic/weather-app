import { callApi } from "./callAPI.js";
import { createListItem } from "./components/dropDownItem.js";
import { forcastItem } from "./components/nextDaysItem.js";
import { changeBackground } from "./changeBackground.js";

$(".home-Btn").click(() => location.reload());

$(".select-country").click(() => {
  $(".fa-caret-down").toggleClass("rotateArrow");
  $(".dropDown").slideToggle(300);
});

const getCountryCode = callApi("GET", "https://flagcdn.com/en/codes.json");

getCountryCode.then((data) => {
  const allCounty = createListItem(data);
  allCounty.forEach((singleCountry) => {
    $(".dropDown ol").append(singleCountry);
  });

  // shutdown loader
  setTimeout(() => {
    $.busyLoadFull("hide");
  }, 2000);
});

// Loader
$("body").busyLoad("show", {
  spinner: "circles",
  background: "var(--blue-light)",
});

$(".dropDown ol").click(function (event) {
  let currentItem = event.target;

  const hasClass = $(currentItem).hasClass("country-flag");
  if (hasClass) {
    currentItem = currentItem.closest("li");
  }

  const clone = $(currentItem).clone();

  $(".select-country")
    .html(`<i class="fa-solid fa-caret-down"></i>`)
    .prepend(clone);
  $(".dropDown").slideToggle();

  const getCities = callApi(
    "GET",
    "https://countriesnow.space/api/v0.1/countries"
  );

  getCities.then((response) => {
    const data = response.data,
      activeCountry = $(".select-country li").text().trim(),
      findCountryInData = data.find(
        (singleElement) => singleElement["country"] === activeCountry
      ),
      allCities = findCountryInData.cities;

    $(".searchLocation").val("");
    $(".search-list").html("");

    $(".searchLocation").on("input", function () {
      const cityName = $(this).val().toLowerCase();

      if (cityName.length === 0) {
        $(".search-list").hide();
        return;
      } else {
        $(".search-list").show();
      }

      const findCity = allCities.filter((singleCity) =>
        singleCity.toLowerCase().includes(cityName)
      );

      if (findCity.length > 0) {
        const cutCities = findCity.slice(0, 5);
        $(".search-list").html("");

        cutCities.forEach((CityName) => {
          const listItem = `<li class="border"><span><i class="fa-solid fa-map-location-dot"></i>${CityName}</span></li>`;

          $(".search-list").append(listItem);
        });

        if (cutCities.length === 1) {
          $(".search-list li").removeClass("border");
        }
      }
    });
  });
});

$(".search-list").click((event) => {
  const chosenCity = $(event.target).text();
  $(".searchLocation").val(chosenCity);
  $(".search-list").text("");
});

function isValidated() {
  const dropdownButton = $(".select-country").text().trim();
  const inputValue = $(".searchLocation").val();
  const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (
    dropdownButton === "Select Country" ||
    inputValue.length === 0 ||
    specialCharacters.test(inputValue)
  ) {
    return false;
  }
  return true;
}

$(".submitBtn").click(() => {
  // Validation
  if (!isValidated()) {
    $(".search-bar").prepend("<p>Form is not valid</p>");
    $(".search-bar > p").addClass("animate__animated animate__shakeX");
    return;
  }

  /* The above JavaScript code is checking if an element with the class "search-bar" has a child
  element of type "p". If such an element exists, it removes the child element (paragraph) from the
  "search-bar" element. */
  const existsError = $(".search-bar > p");
  if (existsError) {
    $(".search-bar > p").remove();
  }

  const searchCity = $(".searchLocation").val().toLowerCase(),
    searchCountry = $(".select-country li").text().toLowerCase();
  const searchLocation = `${searchCity} ${searchCountry}`;
  const ApiInfo = {
    key: "78b424624d9c4ee2a9f75055231211",
    q: searchLocation,
    days: "3",
    aqi: "no",
    alerts: "no",
  };

  const getWeather = callApi(
    "GET",
    "https://api.weatherapi.com/v1/forecast.json",
    ApiInfo
  );

  getWeather.then((data) => {
    $(".searchLocation").val("");
    const countryFlagUrl = $(".country-flag").attr("src");
    const { country } = data.location;
    $(".nameCuntryAndCity img").attr({ src: countryFlagUrl, title: country });

    const { forecastday } = data.forecast;

    const DaysInWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    function ChangeIcon(forcast) {
      forcast = forcast.toLowerCase();
      const cloudyWeather = ["cloudy", "mist", "overcast", "partly cloudy"];

      if (forcast === "heavy rain") {
        return "img/icons/Storm-Day.svg";
      } else if (forcast.includes("rain")) {
        return "img/icons/Rain-Day.svg";
      } else if (
        forcast.includes(...cloudyWeather) ||
        forcast.includes("fog")
      ) {
        return "img/icons/Cloudy-Day.svg";
      } else if (forcast.includes("snow") || forcast.includes("sleet")) {
        return "img/icons/Snow-Day.svg";
      } else if (forcast.includes("sun")) {
        return "img/icons/Clear-Day.svg";
      }
    }

    forecastday.forEach((singleDay, index) => {
      const { date } = singleDay;
      const getDate = new Date(date);
      const currentDay = DaysInWeek[getDate.getDay()],
        currentMonth = allMonths[getDate.getMonth()],
        currentDate = getDate.getDate(),
        currentYear = getDate.getFullYear();

      const displayCurrentDate = `${currentDay}, ${currentMonth} ${currentDate}, ${currentYear}`;

      const { text } = singleDay.day.condition;
      const { maxtemp_c, mintemp_c } = singleDay.day;

      if (index === 0) {
        $(".date p").text(displayCurrentDate);
        $(".MaxAndMinTemp p:first").html(
          `${Math.floor(maxtemp_c)}&deg;c / ${Math.floor(mintemp_c)}&deg;c`
        );
        $(".MaxAndMinTemp p:last").text(text);
      }

      const dayInfo = {
        currentDay: currentDay,
        forcast: text,
        maxTemp: Math.floor(maxtemp_c),
        minTemp: Math.floor(mintemp_c),
        icon: ChangeIcon(text),
      };

      $(".all-Day").append(forcastItem(dayInfo));
    });

    const [activeDay] = forecastday;
    const { daily_chance_of_rain, maxwind_kph, avghumidity, uv } =
      activeDay.day;

    const weatherDetails = [
      `${daily_chance_of_rain}%`,
      `${Math.floor(maxwind_kph)}km/h`,
      `${avghumidity}%`,
      uv,
    ];
    // Adding weather details
    weatherDetails.forEach((value, index) => {
      $(".temperature h2:not(:first)").eq(index).text(value);
    });

    // add time
    let { localtime } = data.location;
    localtime = localtime.split(" ");
    const [locationDate, Time] = localtime;
    $(".time").text(Time);

    // add Temperature
    const { temp_c } = data.current;
    $(".temp h3, .temperature h2:first").html(`${Math.floor(temp_c)}&deg;c`);

    // add name city and county
    const { name } = data.location; // location name
    $(".nameCuntryAndCity p").text(`${name} / ${country}`);

    const currentForcast = $(".MaxAndMinTemp p:last").text();

    const { icon, background } = changeBackground(currentForcast, Time);

    $(".cont2 img").attr("src", `${icon}`);
    $(".background").css({
      background: `url(${background})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    });

    $(".busca").hide();
    $("body").css("background", "var(--gray-900)");
    $(".Dash").css({ display: "flex" });

    $(".Card").addClass("fadeInRight");
    $(".detals, .days").addClass(" animate__fadeIn");
  });
});
