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

function workout(min) {
  data.minutes += min;
  save();
  update();
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
  let current = belts[0];
  for (let b of belts) {
    if (data.minutes >= b.min) current = b;
  }
  return current;
}

function update() {
  let belt = getBelt();

  document.getElementById("belt").innerText =
    "🥋 " + belt.name + " BELT";

  let progress = (data.minutes % 100);

  document.getElementById("progress").style.width =
    progress + "%";

  document.getElementById("stats").innerText =
    `${data.workouts} workouts • ${data.minutes} min • 🔥 ${data.streak} streak`;
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

/* -------- CARD (TIKTOK STYLE) -------- */

function generateCard() {
  const c = document.getElementById("card");
  const ctx = c.getContext("2d");

  let belt = getBelt();

  // background gradient
  const grad = ctx.createLinearGradient(0,0,1080,1080);
  grad.addColorStop(0, "#0a0a0a");
  grad.addColorStop(1, "#1a1a1a");

  ctx.fillStyle = grad;
  ctx.fillRect(0,0,1080,1080);

  // title
  ctx.fillStyle = "white";
  ctx.font = "bold 70px Arial";
  ctx.fillText("FITNESS BELT", 250, 200);

  // belt
  ctx.font = "bold 100px Arial";
  ctx.fillText(belt.name + " BELT", 250, 350);

  // stats
  ctx.font = "50px Arial";
  ctx.fillText(`Workouts: ${data.workouts}`, 250, 500);
  ctx.fillText(`Minutes: ${data.minutes}`, 250, 580);
  ctx.fillText(`Streak: ${data.streak}`, 250, 660);

  // bar
  ctx.fillStyle = "#333";
  ctx.fillRect(250, 750, 600, 30);

  ctx.fillStyle = "#ff8c00";
  ctx.fillRect(250, 750, 400, 30);

  // quote
  ctx.fillStyle = "white";
  ctx.font = "italic 50px Arial";
  ctx.fillText("DISCIPLINE BUILDS IDENTITY", 200, 900);
}

function downloadCard() {
  const c = document.getElementById("card");
  const a = document.createElement("a");
  a.href = c.toDataURL();
  a.download = "fitness-card.png";
  a.click();
}
