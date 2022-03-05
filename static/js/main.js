const error = document.getElementById("error");
const mainDiv = document.getElementById("main");
const searchField = document.getElementById("search");
const content = document.getElementById("content");

const handleClear = () => {
  searchField.value = "";
  mainDiv.style.display = "none";
  error.style.display = "none";
};

const handleNavChange = (e, target) => {
  content.innerHTML = "";
  document
    .querySelectorAll("li")
    .forEach((item) => (item.className = "navitem"));
  e.target.className = "navitem active";
  fetchBackend((func = handlerObj[target]), (url = `/api/${target}`));
};

const handleSubmit = (event) => {
  event.preventDefault();
  mainDiv.style.display = "none";
  error.style.display = "none";
  document
    .querySelectorAll("li")
    .forEach((item) => (item.className = "navitem"));
  document.getElementById("start_nav").className = "navitem active";
  if (searchField.value != "") {
    fetchBackend((func = handlerObj["company"]), (url = "/api/company"));
  }
  searchField.oninvalid;
};

const handleCompany = (obj) => {
  const key_counts = Object.keys(obj).length;
  if (key_counts > 0) {
    content.innerHTML = "";
    const { logo, ticker, name, exchange, ipo, finnhubIndustry } = obj;
    content.innerHTML = `<div class="company">
        <img src="${logo}" alt="${ticker}" class="logo">
        <ul class="company__info">
            <div class="info__titles">
                <li class="info__title">
                    Company Name 
                </li>
                <li class="info__title">
                    Stock ticker symbol 
                </li>
                <li class="info__title">
                    Stock exchange code 
                </li>
                <li class="info__title">
                    Company IPO date 
                </li>
                <li class="info__title">
                    Category 
                </li>
            </div>
            <div class="info__values">
                <li class="info__value">
                    ${name}
                </li>
                <li class="info__value">
                    ${ticker}
                </li>
                <li class="info__value">
                    ${exchange}
                </li>
                <li class="info__value">
                    ${ipo}
                </li>
                <li class="info__value">
                    ${finnhubIndustry}
                </li>
            </div>
        </ul>
    </div>`;
    mainDiv.style.display = "initial";
  }else{
      error.style.display = 'initial'
  }
};

const handleSummary = (obj) => {
  const key_counts = Object.keys(obj).length;
  if (key_counts > 0) {
    content.innerHTML = "";
    const d_icon =
      parseFloat(obj.summary.d) > 0
        ? "GreenArrowUp.png"
        : "RedArrowDown (1).png";
    const dp_icon =
      parseFloat(obj.summary.dp) > 0
        ? "GreenArrowUp.png"
        : "RedArrowDown (1).png";
    const date = new Date(parseInt(obj.summary.t) * 1000).toLocaleDateString()
    content.innerHTML = `<div class="summary">
        <div class="summary__info">
            <div class="summary__content">
                <div class="info__titles">
                    <li class="info__title">
                        Stock ticker symbol 
                    </li>
                    <li class="info__title">
                        Trading day 
                    </li>
                    <li class="info__title">
                        Previous closing price
                    </li>
                    <li class="info__title">
                        Opening price 
                    </li>
                    <li class="info__title">
                        High price 
                    </li>
                    <li class="info__title">
                        Low price 
                    </li>
                    <li class="info__title">
                        Change 
                    </li>
                    <li class="info__title">
                        Change percentage 
                    </li>
                </div>
                <div class="info__values">
                    <li class="info__value">
                        ${obj.trends.symbol}
                    </li>
                    <li class="info__value">
                        ${date}
                    </li>
                    <li class="info__value">
                        ${obj.summary.pc}
                    </li>
                    <li class="info__value">
                        ${obj.summary.o}
                    </li>
                    <li class="info__value">
                        ${obj.summary.h}
                    </li>
                    <li class="info__value">
                        ${obj.summary.l}
                    </li>
                    <li class="info__value">
                        ${obj.summary.d} <img src='${window.location.href}static/img/${d_icon}' id='d_icon'>
                    </li>
                    <li class="info__value">
                        ${obj.summary.dp} <img src='${window.location.href}static/img/${dp_icon}' id='dp_icon'>
                    </li>
                </div>
            </div>
            <div class="trends">
                <p class="sell">Strong sell</p>
                <ul class="trend__lists">
                    <li style="background-color: #ed2a39;" class="trend__item">${obj.trends.strongSell}</li>
                    <li style="background-color: #b25f4a;" class="trend__item">${obj.trends.sell}</li>
                    <li style="background-color: #77945c;" class="trend__item">${obj.trends.hold}</li>
                    <li style="background-color: #3bca6d;" class="trend__item">${obj.trends.buy}</li>
                    <li style="background-color: #37ff9b;" class="trend__item">${obj.trends.strongBuy}</li>
                </ul>
                <p class="buy">Strong buy</p>
            </div>
            <p id="recommand__title">Recommendation Trends</p>
        </div>
    </div>`;
    mainDiv.style.display = "initial";
  }
};

const handleChart = (obj) => {
  const key_counts = obj.length;

  if (key_counts > 0) {
    content.innerHTML = "";
    let volume = [];
    let close = [];
    let symbol = searchField.value.toUpperCase();
    let today = new Date().toLocaleDateString();

    obj.map((record) => {
      let date = record["date"];
      volume.push([date, record["volume"]]);
      close.push([date, record["close"]]);
    });

    content.innerHTML = '<div id="charts-area"></div>';

    Highcharts.stockChart("charts-area", {
      stockTools: {
        gui: {
          enabled: false,
        },
      },

      xAxis: {
        type: "datetime",
        labels: {
          format: "{value:%e. %b}",
        },
      },

      yAxis: [
        {
          title: { text: "Volume" },
          labels: { align: "left" },
          min: 0,
        },
        {
          title: { text: "Stock Price" },
          opposite: false,
          min: 0,
        },
      ],

      plotOptions: {
        column: {
          pointWidth: 2,
          color: "#404040",
        },
      },

      rangeSelector: {
        buttons: [
          {
            type: "day",
            count: 7,
            text: "7d",
          },
          {
            type: "day",
            count: 15,
            text: "15d",
          },
          {
            type: "month",
            count: 1,
            text: "1m",
          },
          {
            type: "month",
            count: 3,
            text: "3m",
          },
          {
            type: "month",
            count: 6,
            text: "6m",
          },
        ],
        selected: 4,
        inputEnabled: false,
      },

      title: { text: "Stock Price " + symbol + " " + today },

      subtitle: {
        text: '<a href="https://finnhub.io/" target="_blank">Sourse: Finnhub</a>',
        useHTML: true,
      },

      series: [
        {
          type: "area",
          name: symbol,
          data: close,
          yAxis: 1,
          showInNavigator: true,
          tooltip: {
            valueDecimals: 2,
          },
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [
                1,
                Highcharts.color(Highcharts.getOptions().colors[0])
                  .setOpacity(0)
                  .get("rgba"),
              ],
            ],
          },
        },
        {
          type: "column",
          name: symbol + " Volume",
          data: volume,
          yAxis: 0,
          showInNavigator: false,
        },
      ],
    });
  }
};

const handleNews = (obj) => {
  if (obj.length > 0) {
    content.innerHTML = "";
    let news_count = 0
    obj.map((item) => {
      if ((item.image !== "") && news_count <= 5) {
        news_count +=1
        date = new Date(parseInt(item.datetime) * 1000).toLocaleDateString();
        content.innerHTML += `<div class="news">
            <img src="${item.image}" alt="${item.category}" class="news__img">
            <div class="news__content">
                <p class="news__para">${item.headline}</p>
                <p class="news__date">${date}</p>
                <a href="${item.url}" target="_blank">see Original post</a>
                
            </div>
        </div>`;
      }
    });
  }
};

const handlerObj = {
  company: handleCompany,
  summary: handleSummary,
  chart: handleChart,
  news: handleNews,
};

const fetchBackend = (func, url) => {
  let xhr = new XMLHttpRequest();
  const symbol = document.getElementById("search").value;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      func(JSON.parse(xhr.responseText));
    }
  };
  xhr.open("GET", url + `?symbol=${symbol.toUpperCase()}`, true);
  xhr.send();
};
