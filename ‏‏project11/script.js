const form = document.getElementById("weatherForm");
const result = document.getElementById("result");
const errorMsg = document.getElementById("error");

const errorMessages = {
  400: "הנתונים שהוזנו אינם תקינים. אנא בדוק את העיר והמפתח ונסה שוב.",
  401: "מפתח ה־API שגוי או חסר. ודא שהזנת אותו נכון והוא פעיל.",
  403: "אין הרשאה לגשת לשירות זה. ייתכן שמפתח ה־API אינו מורשה.",
  404: "לא נמצאה עיר בשם זה. נסה לכתוב באנגלית או לציין גם מדינה.",
  429: "חרגת ממספר הבקשות המותר. נסה שוב בעוד מספר דקות.",
  500: "בעיה זמנית בשרת. אנא נסה שוב מאוחר יותר.",
  default: "התרחשה שגיאה בלתי צפויה. נסה שוב או פנה לתמיכה.",
};

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  result.innerHTML = "";
  errorMsg.textContent = "";

  const city = document.getElementById("city").value.trim();
  const apiKey = document.getElementById("apiKey").value.trim();
  const lang = document.getElementById("language").value;

  if (!/^[a-zA-Z\u0590-\u05FF\s'-]+$/.test(city)) {
    errorMsg.textContent = "שם העיר מכיל תווים לא תקינים";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=${lang}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const message = errorMessages[res.status] || errorMessages.default;
      errorMsg.textContent = message;
      throw new Error(`API Error ${res.status}`);
    }

    const data = await res.json();
    const days = {};

    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!days[date]) days[date] = [];
      days[date].push(item);
    });

    const icons = {
      "clear sky": "☀️",
      "few clouds": "⛅",
      "scattered clouds": "☁️",
      "broken clouds": "☁️",
      "shower rain": "🌧️",
      rain: "🌧️",
      thunderstorm: "🌩️",
      snow: "❄️",
      mist: "🌫️",
    };

    Object.entries(days)
      .slice(0, 5)
      .forEach(([date, items]) => {
        const temps = items.map((i) => i.main.temp);
        const min = Math.min(...temps);
        const max = Math.max(...temps);
        const desc = items[0].weather[0].description;
        const emoji = icons[desc.toLowerCase()] || "";
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
        <p>📅 ${formatDate(date)}</p>
        <p>🌡️ טווח: ${min.toFixed(1)}°C - ${max.toFixed(1)}°C</p>
        <p>${emoji} ${desc}</p>
        <button onclick="toggleGraph('${date}')">הצג תחזית שעתית</button>
        <canvas id="canvas-${date}" style="display:none;"></canvas>
      `;
        result.appendChild(card);

        window[`drawChart_${date}`] = () => {
          const ctx = document
            .getElementById(`canvas-${date}`)
            .getContext("2d");
          const labels = items.map((i) => i.dt_txt.split(" ")[1].slice(0, 5));
          const dataPoints = items.map((i) => i.main.temp);
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "#ff5722");
          gradient.addColorStop(0.5, "#4caf50");
          gradient.addColorStop(1, "#2196f3");

          new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  data: dataPoints,
                  backgroundColor: gradient,
                  borderColor: gradient,
                  fill: false,
                  tension: 0.4,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => `${value}°`,
                  },
                },
              },
            },
          });
        };
      });
  } catch (err) {
    console.error("שגיאת API:", err);
  }
});

function toggleGraph(date) {
  const canvas = document.getElementById(`canvas-${date}`);
  if (canvas.style.display === "none") {
    canvas.style.display = "block";
    if (!canvas.getAttribute("data-drawn")) {
      window[`drawChart_${date}`]();
      canvas.setAttribute("data-drawn", "true");
    }
  } else {
    canvas.style.display = "none";
  }
}
