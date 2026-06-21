// Liste précise des exercices avec leur durée d'effort et de repos (en secondes)
const workoutDatabase = {
    homme: [
        { name: "💪 Pompes classiques", work: 40, rest: 20 },
        { name: "🏋️ Squats Jump (Explosif)", work: 45, rest: 15 },
        { name: "🔥 Burpees", work: 30, rest: 30 },
        { name: "🛡️ Gainage Abdominal", work: 50, rest: 10 },
        { name: "🦅 Mountain Climbers", work: 40, rest: 20 },
        { name: "Leg Raises (Abdos du bas)", work: 45, rest: 15 }
    ],
    femme: [
        { name: "🍑 Squats Sumo (Fessiers)", work: 45, rest: 15 },
        { name: "🏃‍♀️ Fentes alternées sautées", work: 35, rest: 25 },
        { name: "🛡️ Gainage Commando", work: 40, rest: 20 },
        { name: "✨ Glute Bridges (Pont fessier)", work: 50, rest: 10 },
        { name: "🔥 Jumping Jacks", work: 40, rest: 20 },
        { name: "Abdos bicyclette", work: 45, rest: 15 }
    ],
    senior: [
        { name: "🚶‍♂️ Marche active sur place", work: 30, rest: 30 },
        { name: "🪑 Squat assisté avec chaise", work: 35, rest: 25 },
        { name: "🧘‍♂️ Étirement du chat (Dos)", work: 40, rest: 20 },
        { name: "⚖️ Équilibre sur une jambe", work: 30, rest: 30 },
        { name: "🔄 Rotations douces des bras", work: 40, rest: 20 },
        { name: "Talons-fesses en douceur", work: 35, rest: 25 }
    ]
};

let selectedProfile = '';
let selectedDuration = 0; // En minutes
let currentExerciseIndex = 0;
let totalSecondsRemaining = 0;
let currentPhase = 'work'; // 'work' (effort) ou 'rest' (repos)
let phaseSecondsRemaining = 0;
let workoutInterval;

function selectProfile(profile) {
    selectedProfile = profile;
    document.querySelector('.welcome-container').classList.add('hidden');
    document.getElementById('duration-selection').classList.remove('hidden');
}

function selectDuration(minutes) {
    selectedDuration = minutes;
    totalSecondsRemaining = minutes * 60;
    
    updateTotalTimerDisplay();
    
    document.getElementById('duration-selection').classList.add('hidden');
    document.getElementById('workout-session').classList.remove('hidden');
    
    // On prépare le premier exercice
    currentExerciseIndex = 0;
    currentPhase = 'work';
    let firstExercise = workoutDatabase[selectedProfile][currentExerciseIndex];
    phaseSecondsRemaining = firstExercise.work;
    
    document.getElementById('current-exercise-name').innerText = firstExercise.name;
    document.getElementById('exercise-timer').innerText = formatTime(phaseSecondsRemaining);
}

function startWorkout() {
    document.getElementById('start-btn').classList.add('hidden');
    
    workoutInterval = setInterval(() => {
        // 1. Décompte du temps total
        totalSecondsRemaining--;
        updateTotalTimerDisplay();
        
        // Si le temps total est écoulé, on arrête tout
        if (totalSecondsRemaining <= 0) {
            clearInterval(workoutInterval);
            document.getElementById('current-exercise-name').innerText = "🎉 Félicitations ! Séance terminée ! 🥂";
            document.getElementById('exercise-timer').innerText = "00:00";
            document.getElementById('exercise-timer').style.color = "#4cd137"; // Vert pour la victoire
            return;
        }
        
        // 2. Décompte de la phase actuelle (Effort ou Repos)
        phaseSecondsRemaining--;
        document.getElementById('exercise-timer').innerText = formatTime(phaseSecondsRemaining);
        
        // Gestion du changement de phase (Effort <-> Repos)
        if (phaseSecondsRemaining <= 0) {
            let currentExercise = workoutDatabase[selectedProfile][currentExerciseIndex];
            
            if (currentPhase === 'work') {
                // On passe au repos
                currentPhase = 'rest';
                phaseSecondsRemaining = currentExercise.rest;
                document.getElementById('current-exercise-name').innerText = "⏳ RÉCUPÉRATION REPOS";
                document.getElementById('exercise-timer').style.color = "#ffb142"; // Orange pour le repos
            } else {
                // Le repos est fini, on passe à l'exercice suivant
                currentPhase = 'work';
                currentExerciseIndex = (currentExerciseIndex + 1) % workoutDatabase[selectedProfile].length; // Boucle sur la liste
                let nextExercise = workoutDatabase[selectedProfile][currentExerciseIndex];
                
                phaseSecondsRemaining = nextExercise.work;
                document.getElementById('current-exercise-name').innerText = nextExercise.name;
                document.getElementById('exercise-timer').style.color = "#ffffff"; // Blanc/Rouge pour l'effort
            }
        }
        
    }, 1000);
}

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTotalTimerDisplay() {
    document.getElementById('total-timer').innerText = formatTime(totalSecondsRemaining);
}
