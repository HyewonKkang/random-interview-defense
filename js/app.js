const textfield = document.querySelector('.textfield');
const submitButton = document.querySelector('.input-icon');
const questionListContainer = document.querySelector('.question-list');
const questionTemplate = document.getElementById('question-template').content;

const question_list = [];

function listen() {
    textfield.addEventListener('keyup', checkEnterKeyUp);
    submitButton.addEventListener('click', handleSubmit);
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
    foundedEraser.addEventListener('click', () => deleteQuestion(index));
}

function clearInput() {
    textfield.value = '';
}

function deleteQuestion(idx) {
    if (typeof idx !== 'number') return;
    const delEl = questionListContainer.querySelector(`.question-${idx}`);
    questionListContainer.removeChild(delEl);
}

(function init() {
    listen();
})();
