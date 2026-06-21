let lang = "fr";

let data = {
  workouts: 0,
  minutes: 0,
  streak: 0,
  lastDay: null
};

const belts = [
  { name: "WHITE", min: 0 },
  { name: "YELLOW", min: 30 },
  { name: "ORANGE", min: 60 },
  { name: "BLUE", min: 120 },
  { name: "PURPLE", min: 200 },
  { name: "BROWN", min: 300 },
  { name: "BLACK", min: 500 }
];

const t = {
  fr: {
    title: "🥋 Fitness Belt",
    done: "Terminé"
  },
  en: {
    title: "🥋 Fitness Belt",
    done: "Done"
  },
  ar: {
    title: "حزام اللياقة 🥋",
    done: "انتهيت"
  }
};

function setLang(l) {
  lang = l;
  document.getElementById("title").innerText = t[lang].title;
  update();
}

function workout(min) {
  data.minutes += min;
  update();
  save();
}

function finishWorkout() {
  data.workouts++;

  let today = new Date().toDateString();

  if (data.lastDay !== today) {
    data.streak++;
    data.lastDay = today;
  }

  save();
  update();
}

function getBelt() {
  let b = belts[0];

  for (let i = 0; i < belts.length; i++) {
    if (data.minutes >= belts[i].min) {
      b = belts[i];
    }
  }

  return b;
}

function update() {
  let belt = getBelt();

  document.getElementById("belt").innerText =
    "🥋 " + belt.name + " BELT";

  let progress = (data.minutes % 100);

  document.getElementById("progress").style.width =
    progress + "%";

  document.getElementById("stats").innerText =
    `🔥 ${data.workouts} workouts | ⏱ ${data.minutes} min | 🔥 streak ${data.streak}`;
}

function save() {
  localStorage.setItem("fitness", JSON.stringify(data));
}

function load() {
  let d = localStorage.getItem("fitness");
  if (d) data = JSON.parse(d);
}

load();
update();

function generateCard() {
  const c = document.getElementById("card");
  const ctx = c.getContext("2d");

  let belt = getBelt();

  ctx.fillStyle = "#0f0f0f";
  ctx.fillRect(0,0,1080,1080);

  ctx.fillStyle = "white";
  ctx.font = "bold 60px Arial";
  ctx.fillText("FITNESS BELT", 300, 150);

  ctx.font = "bold 80px Arial";
  ctx.fillText(belt.name + " BELT", 300, 300);

  ctx.font = "40px Arial";
  ctx.fillText("Workouts: " + data.workouts, 300, 450);
  ctx.fillText("Minutes: " + data.minutes, 300, 520);
  ctx.fillText("Streak: " + data.streak, 300, 590);

  ctx.fillStyle = "orange";
  ctx.fillRect(300, 700, 500, 40);

  ctx.fillStyle = "white";
  ctx.fillText("DISCIPLINE WINS", 320, 850);
}

function downloadCard() {
  const c = document.getElementById("card");
  const a = document.createElement("a");
  a.href = c.toDataURL();
  a.download = "fitness-card.png";
  a.click();
}
