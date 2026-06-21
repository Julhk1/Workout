let profile = localStorage.getItem("profile");

function selectProfile(p) {
  profile = p;
  localStorage.setItem("profile", p);
  window.location.href = "workout.html";
}

/* ------------------ WORKOUT ------------------ */

let exercises = [];
let current = 0;
let globalTime = 0;
let exerciseTime = 0;
let interval;

function startWorkout(min) {

  document.querySelector(".buttons").style.display = "none";
  document.getElementById("workoutBox").style.display = "block";

  globalTime = min * 60;

  if (profile === "male") {
    exercises = [
      { name: "Squats", time: 30 },
      { name: "Push-ups", time: 30 },
      { name: "Plank", time: 30 },
      { name: "Jumping Jacks", time: 30 }
    ];
  }

  if (profile === "female") {
    exercises = [
      { name: "Squats", time: 30 },
      { name: "Glute Bridge", time: 30 },
      { name: "Abs Crunch", time: 30 },
      { name: "Stretching", time: 30 }
    ];
  }

  if (profile === "senior") {
    exercises = [
      { name: "Walking in place", time: 40 },
      { name: "Arm circles", time: 40 },
      { name: "Gentle squats", time: 40 }
    ];
  }

  current = 0;
  runTimers();
}

function runTimers() {

  clearInterval(interval);

  interval = setInterval(() => {

    globalTime--;
    exerciseTime--;

    if (exerciseTime <= 0) {
      nextExercise();
    }

    if (globalTime <= 0) {
      finishWorkout();
    }

    updateUI();

  }, 1000);

  loadExercise();
}

function loadExercise() {
  if (!exercises[current]) return;

  document.getElementById("exerciseName").innerText =
    "🏋️ " + exercises[current].name;

  exerciseTime = exercises[current].time;
}

function nextExercise() {
  current++;

  if (current >= exercises.length) {
    finishWorkout();
    return;
  }

  loadExercise();
}

function updateUI() {
  document.getElementById("globalTimer").innerText =
    format(globalTime);

  document.getElementById("exerciseTimer").innerText =
    format(exerciseTime);
}

function format(s) {
  let m = Math.floor(s / 60);
  let sec = s % 60;
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

function finishWorkout() {
  clearInterval(interval);

  document.getElementById("workoutBox").style.display = "none";
  document.getElementById("finish").style.display = "block";

  localStorage.setItem("lastWorkout", Date.now());
}
