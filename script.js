const workoutDatabase = {
    homme: [
        { name: "💪 Pompes", work: 40, rest: 20, img: "https://cdn-icons-png.flaticon.com/512/2548/2548564.png", animClass: "pushup-anim" },
        { name: "🏋️ Squats Jump", work: 45, rest: 15, img: "https://cdn-icons-png.flaticon.com/512/2548/2548537.png", animClass: "squat-anim" },
        { name: "🔥 Burpees", work: 30, rest: 30, img: "https://cdn-icons-png.flaticon.com/512/2548/2548531.png", animClass: "burpee-anim" },
        { name: "🛡️ Gainage", work: 50, rest: 10, img: "https://cdn-icons-png.flaticon.com/512/2548/2548486.png", animClass: "plank-anim" }
    ],
    femme: [
        { name: "🍑 Squats Sumo", work: 45, rest: 15, img: "https://cdn-icons-png.flaticon.com/512/2548/2548532.png", animClass: "squat-anim" },
        { name: "🏃‍♀️ Fentes", work: 35, rest: 25, img: "https://cdn-icons-png.flaticon.com/512/2548/2548534.png", animClass: "lunge-anim" },
        { name: "🛡️ Gainage", work: 40, rest: 20, img: "https://cdn-icons-png.flaticon.com/512/2548/2548486.png", animClass: "plank-anim" },
        { name: "✨ Glute Bridges", work: 50, rest: 10, img: "https://cdn-icons-png.flaticon.com/512/2548/2548512.png", animClass: "bridge-anim" }
    ],
    senior: [
        { name: "🚶‍♂️ Marche active", work: 30, rest: 30, img: "https://cdn-icons-png.flaticon.com/512/3048/3048374.png", animClass: "walk-anim" },
        { name: "🪑 Squat sur chaise", work: 35, rest: 25, img: "https://cdn-icons-png.flaticon.com/512/2548/2548537.png", animClass: "chair-anim" },
        { name: "🧘‍♂️ Étirement", work: 40, rest: 20, img: "https://cdn-icons-png.flaticon.com/512/3048/3048398.png", animClass: "stretch-anim" },
        { name: "⚖️ Équilibre", work: 30, rest: 30, img: "https://cdn-icons-png.flaticon.com/512/2548/2548495.png", animClass: "balance-anim" }
    ]
};

let selectedProfile = '';
let selectedDuration = 0;
let currentExerciseIndex = 0;
let totalSecondsRemaining = 0;
let currentPhase = 'work'; // 'work' ou 'rest'
let phaseSecondsRemaining = 0;
let workoutInterval;

function selectProfile(profile) {
    selectedProfile = profile;
    document.getElementById('profile-selection').classList.add('hidden');
    document.getElementById('duration-selection').classList.remove('hidden');
    
    // Génération automatique des petites cases d'aperçu d'exercices
    const previewContainer = document.getElementById('exercises-preview-list');
    previewContainer.innerHTML = '';
    
    workoutDatabase[selectedProfile].forEach(ex => {
        let item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `
            <img src="${ex.img}" alt="${ex.name}" class="preview-icon">
            <div class="preview-info">
                <strong>${ex.name}</strong>
                <span>${ex.work}s / ${ex.rest}s</span>
            </div>
        `;
        previewContainer.appendChild(item);
    });
}

function selectDuration(minutes) {
    selectedDuration = minutes;
    totalSecondsRemaining = minutes * 60;
    updateTotalTimerDisplay();
    
    document.getElementById('duration-selection').classList.add('hidden');
    document.getElementById('workout-session').classList.remove('hidden');
    document.getElementById('site-header').classList.add('hidden');
    
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
            document.getElementById('current-exercise-name').innerText = "🎉 Félicitations ! Séance terminée ! 🥂";
            document.getElementById('exercise-timer').innerText = "00:00";
            document.getElementById('exercise-timer').style.color = "#2ed573";
            document.getElementById('exercise-visual').className = "animation-placeholder";
            document.getElementById('exercise-visual').style.background = "#2ed573";
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
    if (confirm("Voulez-vous vraiment abandonner l'entraînement et revenir à l'accueil ?")) {
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
