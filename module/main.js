/*
  TODO:
    1) rasporediti elemente po komponentama.
    2) uprostiti funkcional.
    3) preimenovati sve variable da to bude jasno.
    4) variable koje ne menjaju svoje znacenje u kodu promeniti na konstante.
*/
import { callApi } from "./callAPI.js";
import { createListItem } from "./components/dropDownItem.js";

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

  let clone = $(currentItem).clone();

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

      let findCity = allCities.filter((singleCity) =>
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
  // TODO: nije zavrsena obrada podataka iz Api-a
  getWeather.then((data) => {
    $(".searchLocation").val("");
    const countryFlagUrl = $(".country-flag").attr("src");
    const { country } = data.location;
    $(".nameCuntryAndCity img").attr({ src: countryFlagUrl, title: country });
  });

  $.ajax({
    type: "GET",
    url: "https://api.weatherapi.com/v1/forecast.json", // API has a limit of 3 days only
    data: {
      key: "78b424624d9c4ee2a9f75055231211",
      q: searchLocation,
      days: "5",
      aqi: "no",
      alerts: "no",
    },
    success: (response) => {
      $(".searchLocation").val("");
      
  //  ========================================================
      let prognoseAllDay = response.forecast.forecastday;

      let allDayInWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      let allMounth = [
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

      prognoseAllDay.forEach((singleDay, index) => {
        let date = new Date(singleDay.date);
        if (index === 0) {
          $(".date p").text(
            `${allDayInWeek[date.getDay()]}, ${
              allMounth[date.getMonth()]
            } ${date.getDate()}, ${date.getFullYear()}`
          );
        }

        // Forecast for 3 days
        $(".day-name").eq(index).text(allDayInWeek[date.getDay()]);
        $(".day-prognose > p").eq(index).text(singleDay.day.condition.text);
        $(".Max-temp")
          .eq(index)
          .html(`${Math.floor(singleDay.day.maxtemp_c)}&deg;c`);
        $(".Min-temp")
          .eq(index)
          .html(`${Math.floor(singleDay.day.mintemp_c)}&deg;c`);
      });
      $(".day-img img").each((index, singleElement) => {
        let dayTemp = $(".day-prognose > p").eq(index).text();
        changeIcons(singleElement, dayTemp);
      });

      function changeIcons(element, value) {
        switch (value) {
          case "Sunny":
            $(element).attr("src", "img/icons/Clear-Day.svg");
            break;

          case "Patchy rain possible":
          case "Moderate rain":
            $(element).attr("src", "img/icons/Rain-Day.svg");
            break;

          case "Partly cloudy":
            $(element).attr("src", "img/icons/FewClouds-Day.svg");
            break;
          case "Heavy snow":
          case "Patchy heavy snow":
          case "Moderate snow":
          case "Moderate or heavy snow showers":
          case "Blowing snow":
          case "Blizzard":
          case "Light snow":
          case "Light sleet":
            $(element).attr("src", "img/icons/Snow-Day.svg");
            break;
          case "Cloudy":
          case "Overcast":
          case "Mist":
          case "Partly Cloudy":
            $(element).attr("src", "img/icons/Cloudy-Day.svg");
            break;
          case "Heavy rain":
            $(element).attr("src", "img/icons/Storm-Day.svg");
        }
      }
      // Adding weather details
      $(".temperature h2").each((index, singleElement) => {
        switch (index) {
          case 1:
            $(singleElement).text(
              `${prognoseAllDay[0].day.daily_chance_of_rain}%`
            );
            break;
          case 2:
            $(singleElement).text(
              `${Math.floor(prognoseAllDay[0].day.maxwind_kph)}km/h`
            );
            break;
          case 3:
            $(singleElement).text(`${prognoseAllDay[0].day.avghumidity}%`);
            break;
          case 4:
            $(singleElement).text(prognoseAllDay[0].day.uv);
            break;
        }
      });

      // add time
      let localTime = response.location.localtime;
      localTime = localTime.split(" ");
      $(".time").text(localTime[1]);

      // add courrend forcast
      $(".MaxAndMinTemp p:last").text(prognoseAllDay[0].day.condition.text);

      // add Temperature
      let temperature = response.current.temp_c;
      $(".temp h3, .temperature h2:first").html(
        `${Math.floor(temperature)}&deg;c`
      );

      // add max and min temp
      let maxTemp = prognoseAllDay[0].day.maxtemp_c;
      let minTemp = prognoseAllDay[0].day.mintemp_c;

      $(".MaxAndMinTemp p:first").html(
        `${Math.floor(maxTemp)}&deg;c / ${Math.floor(minTemp)}&deg;c`
      );

      // add name city and county
      $(".nameCuntryAndCity p").text(
        `${response.location.name}/${response.location.country}`
      );

      let time = response.location.localtime.slice(11).split(":")[0];
      changeBackground(
        ".cont2 img",
        $(".MaxAndMinTemp > p:last").text(),
        +time
      );

      function changeBackground(element, value, time) {
        switch (value) {
          case "Sunny":
            if (time >= 6 && time <= 18) {
              $(element).attr("src", "img/icons/Clear-Day.svg");
              $(".background").css({
                background: "url(img/Day-backround/2.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            } else {
              $(element).attr("src", "img/icons/Clear-Night.svg");
              $(".background").css({
                background: "url(img/Night-background/2.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            }
            break;

          case "Patchy rain possible":
          case "Moderate rain":
            if (time >= 6 && time <= 18) {
              $(element).attr("src", "img/icons/Rain-Day.svg");
              $(".background").css({
                background: "url(img/Day-backround/5.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            } else {
              $(element).attr("src", "img/icons/Rain-Night.svg");
              $(".background").css({
                background: "url(img/Night-background/5.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            }
            break;

          case "Partly cloudy":
            if (time >= 6 && time <= 18) {
              $(element).attr("src", "img/icons/FewClouds-Day.svg");
              $(".background").css({
                background: "url(img/Day-backround/4.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            } else {
              $(element).attr("src", "img/icons/FewClouds-Night.svg");
              $(".background").css({
                background: "url(img/Night-background/4.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            }
            break;
          case "Heavy snow":
          case "Patchy heavy snow":
          case "Moderate snow":
          case "Moderate or heavy snow showers":
          case "Blowing snow":
          case "Blizzard":
          case "Light snow":
          case "Light sleet":
            if (time >= 6 && time <= 18) {
              $(element).attr("src", "img/icons/Snow-Day.svg");
              $(".background").css({
                background: "url(img/Day-backround/6.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            } else {
              $(element).attr("src", "img/icons/Snow-Night.svg");
              $(".background").css({
                background: "url(img/Night-background/6.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            }
            break;
          case "Cloudy":
          case "Overcast":
          case "Mist":
            if (time >= 6 && time <= 18) {
              $(element).attr("src", "img/icons/Cloudy-Day.svg");
              $(".background").css({
                background: "url(img/Day-backround/3.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            } else {
              $(element).attr("src", "img/icons/Cloudy-Night.svg");
              $(".background").css({
                background: "url(img/Night-background/3.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            }
            break;
          case "Heavy rain":
            if (time >= 6 && time <= 18) {
              $(element).attr("src", "img/icons/Storm-Day.svg");
              $(".background").css({
                background: "url(img/Day-backround/5.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            } else {
              $(element).attr("src", "img/icons/Storm-Night.svg");
              $(".background").css({
                background: "url(img/Night-background/5.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              });
            }
            break;
        }
      }

      $(".busca").hide();
      $("body").css("background", "var(--gray-900)");
      $(".Dash").css({ display: "flex" });

      $(".Card").addClass("fadeInRight");
      $(".detals, .days").addClass(" animate__fadeIn");
    },
  });
});
