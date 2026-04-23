const triviaData = {
    // ... המאגר המלא שלך (נשאר ללא שינוי)
    "maps": [
        { "question": "היכן נמצא הר תבור?", "options": ["הכרמל ורמות מנשה", "השומרון ובקעת הירדן", "גליל עליון", "גליל תחתון"], "correct": 3 },
        { "question": "היכן נמצא הר גלבוע?", "options": ["השומרון ובקעת הירדן", "גליל עליון", "הכרמל ורמות מנשה", "גליל תחתון"], "correct": 0 },
        { "question": "ליד איזו עיר נמצא הר מירון?", "options": ["נצרת", "קרית שמונה", "קצרין", "צפת"], "correct": 3 },
        { "question": "מהו חבל הארץ המערבי ביותר במדינה?", "options": ["מישור החוף", "מדבר יהודה", "הכרמל ורמות מנשה", "השומרון ובקעת הירדן"], "correct": 0 },
        { "question": "היכן נמצאת העיר רהט?", "options": ["הרי יהודה", "מישור החוף", "מדבר יהודה", "נגב"], "correct": 3 }
    ],
    "heritage": [
        { "question": "כיצד מכונים היהודים שנותרו בספרד לאחר הגירוש ואולצו להתנצר?", "options": ["פלאשמורה", "אנוסים", "רפורמים", "מוסתערבים"], "correct": 1 },
        { "question": "איזו עיר ייסדה מחדש דונה גרציה?", "options": ["טבריה", "צפת", "ירושלים", "עכו"], "correct": 0 },
        { "question": "איזו מילה לא מופיעה במגילת העצמאות?", "options": ["ציונית", "שואה", "יהודית", "דמוקרטית"], "correct": 3 }
    ],
    "military_and_medical": [
        { "question": "מהו 'פער' על פי מודל התחקיר?", "options": ["חריגה מפקודה", "אי ביצוע משימה", "ההפרש בין 'מה היה' לבין 'מה היה צריך להיות'", "טעות אנוש"], "correct": 2 },
        { "question": "מהו 'משולש החיים' בעזרה ראשונה?", "options": ["לב, ריאות, כליות", "נשימה, דם, עצבים", "הכרה, דופק, חום", "חבישה, קיבוע, פינוי"], "correct": 1 },
        { "question": "באילו מצבים נניח חסם עורקים (ח\"ע)?", "options": ["בכל פציעה", "תחת אש או קטיעה", "הכשת נחש", "כאשר יש שטף דם בבטן"], "correct": 1 }
    ],
    "history_dates": [
        { "question": "באיזה תאריך הוחלט על דגל מדינת ישראל?", "options": ["14.05.1948", "28.10.1948", "15.01.1949", "29.11.1947"], "correct": 1 },
        { "question": "באיזו שנה נוסד בנק ישראל?", "options": ["1948", "1950", "1954", "1960"], "correct": 2 },
        { "question": "מתי נחתם הסכם השלום עם ירדן?", "options": ["1977", "1993", "1994", "1995"], "correct": 2 }
    ],
    "tradition_and_general": [
        { "question": "מהו התאריך הרווח ביותר לחגיגת חג המולד?", "options": ["01/01", "24/12", "25/12", "06/01"], "correct": 2 },
        { "question": "על איזו עדה חל חוק גיוס חובה בישראל?", "options": ["בדואים", "צ'רקסים ודרוזים", "נוצרים", "מוסלמים סונים"], "correct": 1 }
    ]
};

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// פונקציית עזר לערבוב מערך (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function prepareGame(category) {
    const countSelect = document.getElementById('question-count');
    const requestedCount = parseInt(countSelect.value);
    startGame(category, requestedCount);
}

function startGame(category, count) {
    // יצירת עותק של השאלות כדי לא להרוס את המאגר המקורי
    if (category === 'all') {
        currentQuestions = Object.values(triviaData).flat();
    } else {
        currentQuestions = [...triviaData[category]];
    }

    // 1. ערבוב רנדומלי של רשימת השאלות
    shuffleArray(currentQuestions);
    
    // 2. חיתוך לכמות המבוקשת
    currentQuestions = currentQuestions.slice(0, count);

    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('category-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    showQuestion();
}

function showQuestion() {
    answered = false;
    const questionData = currentQuestions[currentQuestionIndex];
    
    // שמירת התשובה הנכונה לפני שמערבבים את האופציות
    const correctAnswerText = questionData.options[questionData.correct];
    
    // יצירת מערך אופציות חדש ומעורבב
    let shuffledOptions = [...questionData.options];
    shuffleArray(shuffledOptions);
    
    // מציאת האינדקס החדש של התשובה הנכונה לאחר הערבוב
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

    document.getElementById('progress').innerText = `שאלה ${currentQuestionIndex + 1} מתוך ${currentQuestions.length}`;
    document.getElementById('score').innerText = `ניקוד: ${score}`;
    document.getElementById('question-text').innerText = questionData.question;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    shuffledOptions.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        // מעבירים לפונקציית הבדיקה את האינדקס החדש והנכון
        button.onclick = () => checkAnswer(index, newCorrectIndex, button);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex, correctIndex, clickedButton) {
    if (answered) return;
    answered = true;

    const buttons = document.getElementById('options-container').getElementsByTagName('button');

    if (selectedIndex === correctIndex) {
        clickedButton.classList.add('correct');
        score++;
    } else {
        clickedButton.classList.add('wrong');
        buttons[correctIndex].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            showQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

function endGame() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('final-score').innerText = `סיימת עם ${score} תשובות נכונות מתוך ${currentQuestions.length}`;
}

function resetGame() {
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('category-screen').classList.remove('hidden');
}