const workoutDatabase = {
    homme: [
        { name: "💪 Pompes classiques", work: 40, rest: 20, animClass: "pushup-anim" },
        { name: "🏋️ Squats Jump", work: 45, rest: 15, animClass: "squat-anim" },
        { name: "🔥 Burpees", work: 30, rest: 30, animClass: "burpee-anim" },
        { name: "🛡️ Gainage Abdominal", work: 50, rest: 10, animClass: "plank-anim" }
    ],
    femme: [
        { name: "🍑 Squats Sumo", work: 45, rest: 15, animClass: "squat-anim" },
        { name: "🏃‍♀️ Fentes sautées", work: 35, rest: 25, animClass: "lunge-anim" },
        { name: "🛡️ Gainage Commando", work: 40, rest: 20, animClass: "plank-anim" },
        { name: "✨ Glute Bridges", work: 50, rest: 10, animClass: "bridge-anim" }
    ],
    senior: [
        { name: "🚶‍♂️ Marche active", work: 30, rest: 30, animClass: "walk-anim" },
        { name: "🪑 Squat sur chaise", work: 35, rest: 25, animClass: "chair-anim" },
        { name: "🧘‍♂️ Étirement du dos", work: 40, rest: 20, animClass: "stretch-anim" },
        { name: "⚖️ Équilibre", work: 30, rest: 30, animClass: "balance-anim" }
    ]
};

let selectedProfile = '';
let selectedDuration = 0;
let currentExerciseIndex = 0;
let totalSecondsRemaining = 0;
let currentPhase = 'work';
let phaseSecondsRemaining = 0;
let workoutInterval;

function selectProfile(profile) {
    selectedProfile = profile;
    document.getElementById('profile-selection').classList.add('hidden');
    document.getElementById('duration-selection').classList.remove('hidden');
    
    // Générer l'aperçu de la liste des exercices
    const previewContainer = document.getElementById('exercises-preview-list');
    previewContainer.innerHTML = '';
    workoutDatabase[selectedProfile].forEach(ex => {
        let item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `<strong>${ex.name}</strong><br><small>Effort: ${ex.work}s | Repos: ${ex.rest}s</small>`;
        previewContainer.appendChild(item);
    });
}

function selectDuration(minutes) {
    selectedDuration = minutes;
    totalSecondsRemaining = minutes * 60;
    updateTotalTimerDisplay();
    
    document.getElementById('duration-selection').classList.add('hidden');
    document.getElementById('workout-session').classList.remove('hidden');
    document.getElementById('site-header').classList.add('hidden'); // Cache le gros titre pour faire de la place
    
    currentExerciseIndex = 0;
    currentPhase = 'work';
    loadExercise();
}

function loadExercise() {
    let exercise = workoutDatabase[selectedProfile][currentExerciseIndex];
    if (currentPhase === 'work') {
        document.getElementById('current-exercise-name').innerText = exercise.name;
        phaseSecondsRemaining = exercise.work;
        document.getElementById('exercise-timer').style.color = "#ffffff";
        
        // Appliquer l'animation correspondante (bras/jambes qui bougent via CSS)
        document.getElementById('exercise-visual').className = `animation-placeholder ${exercise.animClass}`;
    } else {
        document.getElementById('current-exercise-name').innerText = "⏳ RÉCUPÉRATION REPOS";
        phaseSecondsRemaining = exercise.rest;
        document.getElementById('exercise-timer').style.color = "#ffb142";
        document.getElementById('exercise-visual').className = "animation-placeholder rest-anim";
    }
    document.getElementById('exercise-timer').innerText = formatTime(phaseSecondsRemaining);
}

function startWorkout() {
    document.getElementById('start-btn').classList.add('hidden');
    
    workoutInterval = setInterval(() => {
        totalSecondsRemaining--;
        updateTotalTimerDisplay();
        
        if (totalSecondsRemaining <= 0) {
            clearInterval(workoutInterval);
            document.getElementById('current-exercise-name').innerText = "🎉 Séance terminée ! Bravo !";
            document.getElementById('exercise-timer').innerText = "00:00";
            document.getElementById('exercise-visual').className = "animation-placeholder victory-anim";
            return;
        }
        
        phaseSecondsRemaining--;
        document.getElementById('exercise-timer').innerText = formatTime(phaseSecondsRemaining);
        
        if (phaseSecondsRemaining <= 0) {
            if (currentPhase === 'work') {
                currentPhase = 'rest';
            } else {
                currentPhase = 'work';
                currentExerciseIndex = (currentExerciseIndex + 1) % workoutDatabase[selectedProfile].length;
            }
            loadExercise();
        }
    }, 1000);
}

function confirmQuit() {
    if (confirm("Voulez-vous vraiment arrêter l'entraînement et revenir à l'accueil ?")) {
        clearInterval(workoutInterval);
        resetToHome();
    }
}

function resetToHome() {
    clearInterval(workoutInterval);
    selectedProfile = '';
    selectedDuration = 0;
    currentExerciseIndex = 0;
    
    document.getElementById('workout-session').classList.add('hidden');
    document.getElementById('duration-selection').classList.add('hidden');
    document.getElementById('profile-selection').classList.remove('hidden');
    document.getElementById('site-header').classList.remove('hidden');
    document.getElementById('start-btn').classList.remove('hidden');
}

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTotalTimerDisplay() {
    document.getElementById('total-timer').innerText = formatTime(totalSecondsRemaining);
}
