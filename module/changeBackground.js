const allForcast = [
  ["Sunny"],
  [
    "Patchy rain possible",
    "Moderate rain",
    "Partly cloudy",
    "Patchy rain nearby",
  ],
  [
    "Heavy snow",
    "Patchy heavy snow",
    "Moderate snow",
    "Moderate or heavy snow showers",
    "Blowing snow",
    "Blizzard",
    "Light snow",
    "Light sleet",
  ],
  ["Cloudy", "Overcast", "Mist", "Partly cloudy",],
  ["Heavy rain"],
];
const forcastBackgrounds = new Map();

forcastBackgrounds
  .set(allForcast[0], [
    {
      icon: "img/icons/Clear-Day.svg",
      background: "img/Day-backround/2.png",
    },
    {
      icon: "img/icons/Clear-Night.svg",
      background: "img/Night-background/2.png",
    },
  ])
  .set(allForcast[1], [
    { icon: "img/icons/Rain-Day.svg", background: "img/Day-backround/5.png" },
    {
      icon: "img/icons/Rain-Night.svg",
      background: "img/Night-background/5.png",
    },
  ])
  .set(allForcast[2], [
    {
      icon: "img/icons/Snow-Day.svg",
      background: "img/Day-backround/6.png",
    },
    {
      icon: "img/icons/Snow-Night.svg",
      background: "img/Night-background/6.png",
    },
  ])
  .set(allForcast[3], [
    {
      icon: "img/icons/Cloudy-Day.svg",
      background: "img/Day-backround/3.png",
    },
    {
      icon: "img/icons/Cloudy-Night.svg",
      background: "img/Night-background/3.png",
    },
  ])
  .set(allForcast[4], [
    {
      icon: "img/icons/Storm-Day.svg",
      background: "img/Day-backround/5.png",
    },
    {
      icon: "img/icons/Storm-Night.svg",
      background: "img/Night-background/5.png",
    },
  ]);

export function changeBackground(forcast, time) {
  const keys = [...forcastBackgrounds.keys()];

  const indexItem = keys.findIndex((item) => item.includes(forcast));

  const [day, night] = forcastBackgrounds.get(allForcast[indexItem]);

  if (time >= "06:00" && time <= "18:00") {
    return day;
  } else {
    return night;
  }
}
