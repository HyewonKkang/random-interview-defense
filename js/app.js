const textfield = document.querySelector('.textfield');
const submitButton = document.querySelector('.input-icon');
const questionListContainer = document.querySelector('.question-list');
const questionTemplate = document.getElementById('question-template').content;
const modalContainer = document.querySelector('.modal-wrapper');
const startBtn = document.querySelector('.start-button');
const backBtn = document.querySelector('.back-button');
const checkBtn = document.querySelector('.check-button');
const skipBtn = document.querySelector('.skip-forward-button');
const questionElement = document.querySelector('.question');
const questionNumberElement = document.querySelector('.number');
const questionFieldNumber = document.querySelector('.question-number');
const correctedCountElement = document.querySelector('.count');
const totalCountElement = document.querySelector('.total');

let question_list = [];
let cur_question = null;
let corrected = 0;
let count = 0;

let showModal = false;

function listen() {
    textfield.addEventListener('keyup', checkEnterKeyUp);
    submitButton.addEventListener('click', handleSubmit);

    startBtn.addEventListener('click', handleStartButton);
    backBtn.addEventListener('click', handleExitButton);
    checkBtn.addEventListener('click', checkQuestion);
    skipBtn.addEventListener('click', skipQuestion);
}

function checkEnterKeyUp(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        handleSubmit();
    }
}

function handleSubmit() {
    const input = textfield.value;
    if (input === '') return;
    addQuestion(input);
    saveListToLocalStorage();
    clearInput();
}

function addQuestion(text) {
    const liEl = questionTemplate.querySelector('li');
    const spanEl = questionTemplate.querySelector('span');
    const inputEl = questionTemplate.querySelector('input');
    const labelEl = questionTemplate.querySelector('label');
    const eraserBtn = questionTemplate.querySelector('button');
    const index = question_list.length;
    const liInfo = `check-${index}`;

    question_list.push(text);
    spanEl.textContent = text;

    liEl.className = `question-${index}`;
    inputEl.id = liInfo;
    labelEl.htmlFor = liInfo;
    eraserBtn.classList.add(`eraser-${index}`);
    questionListContainer.appendChild(document.importNode(liEl, true));

    const foundedEraser = questionListContainer.querySelector(`.eraser-${index}`);
    foundedEraser.addEventListener('click', () => deleteQuestion(index, text));
}

function clearInput() {
    textfield.value = '';
}

function deleteQuestion(idx, text) {
    if (typeof idx !== 'number') return;
    const delEl = questionListContainer.querySelector(`.question-${idx}`);
    questionListContainer.removeChild(delEl);

    const delIndex = question_list.indexOf(text);
    if (delIndex !== -1) {
        question_list.splice(delIndex, 1);
    }
    saveListToLocalStorage();
}

function handleStartButton() {
    let questions = questionListContainer.querySelectorAll('li').length;
    if (!questions) return;
    showModal = true;
    modalContainer.classList.add('modal-show');
    totalCountElement.textContent = questions;
    corrected = questions - getNotCheckedLi().length;
    correctedCountElement.textContent = corrected;
    cur_question = null;
    setupQuestion();
}

function setupQuestion() {
    cur_question = getRandomLiEl();
    if (!cur_question) {
        finish();
        return;
    }
    const q = cur_question.querySelector('span').textContent;
    questionElement.textContent = q;
    setupQuestionNumber();
}

function setupQuestionNumber() {
    count += 1;

    const formattedCount = count.toString().padStart(2, '0');
    questionNumberElement.textContent = `${formattedCount}.`;
    questionFieldNumber.textContent = `${formattedCount}.`;
}

function finish() {
    handleExitButton();
}

function handleExitButton() {
    showModal = false;
    modalContainer.classList.remove('modal-show');
}

function checkQuestion() {
    const checkbox = cur_question.querySelector('.checkbox');
    checkbox.checked = true;
    corrected += 1;
    correctedCountElement.textContent = corrected;
    setupQuestion();
}

function skipQuestion() {
    setupQuestion();
}

function getRandomLiEl() {
    const filtered = getNotCheckedLi();
    if (!filtered.length) return;
    return filtered[Math.floor(Math.random() * filtered.length)];
}

function getNotCheckedLi() {
    const questions = questionListContainer.querySelectorAll('li');
    if (!questions) return;
    return Array.from(questions).filter((li) => {
        const checkbox = li.querySelector('.checkbox');
        return !checkbox.checked;
    });
}

function saveListToLocalStorage() {
    localStorage.setItem('questionList', JSON.stringify(question_list));
}

// -- deprecated: 쿠키 크기 이슈
//
// function saveListToCookie() {
//     const converted = JSON.stringify(question_list);
//     document.cookie = 'questionList=' + converted;
// }

// function replaceSemicolon(str) {
//     return str.replace(/;/g, '');
// }

// function getListFromCookie() {
//     const cookieData = document.cookie;
//     const cookieName = `questionList=`;
//     let cookieValue = '';
//     let start = cookieData.indexOf(cookieName);
//     if (start === -1) return null;
//     start += cookieName.length;
//     let end = cookieData.indexOf(';', start);
//     if (end === -1) end = cookieData.length;
//     cookieValue = cookieData.substring(start, end);
//     if (cookieValue && cookieValue !== 'undefined')
//         return JSON.parse(replaceSemicolon(cookieValue));
// }

(function init() {
    // deprecated
    //
    // let toImported = window.confirm(
    //     '쿠키에 있는 정보를 가져오시겠습니까? 취소 시 이전 리스트는 삭제됩니다.',
    // );
    // if (toImported) {
    //     let prevData = getListFromCookie();
    //     if (prevData) {
    //         for (let i = 0; i < prevData.length; i++) {
    //             addQuestion(prevData[i]);
    //         }
    //     }
    // }

    let toImported = window.confirm(
        '로컬 스토리지에 저장된 정보를 가져오시겠습니까? 취소 시 이전 리스트는 삭제됩니다.',
    );

    if (toImported) {
        let prevData = JSON.parse(localStorage.getItem('questionList'));
        if (prevData) {
            for (let i = 0; i < prevData.length; i++) {
                addQuestion(prevData[i]);
            }
        }
    }

    listen();
})();
