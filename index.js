var timerValue = 30;
var scoreValue = 0;
var hitsValue = 0;
let playerName = "";
let timeInterval = null;

// Create bubbles
const createBubble = () => {
    const rows = 8;
    const cols = 8;
    let html = '';
    for (let r = 0; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++) {
            const color = getRandomColor();
            html += `<td><div class="bubble" style="background-color:${color}">${Math.floor(Math.random() * 10)}</div></td>`;
        }
        html += '</tr>';
    }
    document.getElementById('bubble-table-body').innerHTML = html;
};

// Timer logic
const setTimeing = () => {
    var timerNode = document.querySelector('.timer');
    if (timeInterval) clearInterval(timeInterval);
    timeInterval = setInterval(() => {
        if (timerValue > 0) {
            timerValue--;
            timerNode.textContent = timerValue;
        } else {
            clearInterval(timeInterval);
            saveHighScore({ name: playerName, score: scoreValue });
            displayHighScores();
            document.querySelector('.content').innerHTML = `
                <h1 class="gameOver">
                    GAME OVER <br>
                    <button onclick="restartGame()">Restart</button>
                </h1>
            `;
        }
    }, 1000);
};

// Generate new hit value
const hitsgenerate = () => {
    hitsValue = Math.floor(Math.random() * 10);
    document.querySelector('.hitsvalue').textContent = hitsValue;
};

// Update score
const score = () => {
    scoreValue += 10;
    document.querySelector('.scoreValue').textContent = scoreValue;
};

// Bubble click event
document.querySelector('.content').addEventListener('click', (e) => {
    if (e.target.classList.contains('bubble') && Number(e.target.textContent) === hitsValue) {
        // Play pop sound
        const popSound = document.getElementById('pop-sound');
        if (popSound) {
            popSound.currentTime = 0;
            popSound.play();
        }
        e.target.classList.add('pop');
        setTimeout(() => e.target.classList.remove('pop'), 300);
        score();
        createBubble();
        hitsgenerate();
    }
});

// Restart game
const restartGame = () => {
    document.querySelector('.content').innerHTML = `
        <div class="Starting">
            <input type="text" id="player-name" class="starting-text" placeholder="Enter your name" />
            <button class="starting-text" onclick="Startingfun()">Start</button>
        </div>
        <table class="bubble-table" style="margin: 24px auto;">
            <tbody id="bubble-table-body"></tbody>
        </table>
    `;
    document.querySelector('.scoreValue').textContent = 0;
    document.querySelector('.timer').textContent = 30;
    timerValue = 30;
    scoreValue = 0;
    playerName = "";
    displayHighScores();
};

// Start game after name entered
const Startingfun = () => {
    const nameInput = document.getElementById('player-name');
    if (!nameInput || nameInput.value.trim() === "") {
        alert("Please enter your name to start the game!");
        return;
    }
    playerName = nameInput.value.trim();
    timerValue = 30;
    scoreValue = 0;
    document.querySelector('.scoreValue').textContent = scoreValue;
    document.querySelector('.timer').textContent = timerValue;
    // Show the bubble table (don't replace .content, just fill the table)
    createBubble();
    hitsgenerate();
    setTimeing();
};

// High score logic
function saveHighScore(entry) {
    fetch('https://bubble-game-wysd.onrender.com/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    }).then(() => displayHighScores());
}

function displayHighScores() {
    fetch('https://bubble-game-wysd.onrender.com/highscores')
        .then(res => res.json())
        .then(scores => {
            const tbody = document.getElementById('high-scores-list');
            if (!tbody) return;
            tbody.innerHTML = '';
            scores.forEach((entry, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${idx + 1}</td><td>${entry.name}</td><td>${entry.score}</td>`;
                tbody.appendChild(tr);
            });
        });
}

// Show high scores on load
window.onload = displayHighScores;

// Helper for random bubble color
function getRandomColor() {
    const colors = [
        "#ff8a80", "#ffd180", "#a7ffeb", "#82b1ff", "#ea80fc", "#b9f6ca", "#ffff8d", "#ff9e80"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
