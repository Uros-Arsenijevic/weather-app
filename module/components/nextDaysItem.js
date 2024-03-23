export function forcastItem(obj) {
  const { currentDay, forcast, maxTemp, minTemp, icon } = obj;
  return `
  <li class="Day">
    <p class="day-name">${currentDay}</p>
    <div class="day-img">
        <img src="${icon}" alt="">
    </div>
    <div class="day-prognose">
      <p>${forcast}</p>
      <div class="minAndMaxTemp">
          <p class="Max-temp">${maxTemp}&deg;c</p>
          /
          <p class="Min-temp">${minTemp}&deg;c</p>
      </div>
    </div>
  </li>
  `;
}
