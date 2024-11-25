const ulElem = document.getElementById('todos');
const toggle = document.getElementById('toggle');
const form = document.getElementById('form');
const input = document.getElementById('input');
const clearBtn = document.getElementById('clear-btn');
let btns = document.querySelector('.btns').children;

btns = [...btns];
let inputID = 1;
let currentSelectors;


/* EVENT Listeners */

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value === '') return;

  addTodo();
});

btns.forEach((btn, idx, btns) => {
  const cmd = btn.innerText.toLowerCase();
  btn.addEventListener('click', () => filterHandler(`${cmd}`, btn, btns));
});

toggle.addEventListener('click', toggleLightMode);
clearBtn.addEventListener('click', clearCompleted);

ulElem.addEventListener('dragenter', dragEnter);
ulElem.addEventListener('dragover', dragOver);
ulElem.addEventListener('dragleave', dragLeave);
ulElem.addEventListener('drop', drop);

/* GET Todos: Default or From Local Storage */

const defaultTodos = [
  { text: 'Complete online JavaScript course', done: true },
  { text: 'Jog around the park 3x', done: false },
  { text: '10 minutes meditation', done: false },
  { text: 'Read for 1 hour', done: false },
  { text: 'Pick up groceries', done: false },
  { text: 'Complete Todo App on Frontend Mentor', done: false }
];

const todos = JSON.parse(localStorage.getItem('todos'));

if (todos.length >= 1) {
  todos.forEach((todo => addTodo(todo)));
} else {
  defaultTodos.forEach((todo => addTodo(todo)));
}

/* Functions */

function addTodo(todo) {
  let todoMessage = input.value;

  if (todo) {
    todoMessage = todo.text;
  }

  const listEl = document.createElement('li');
  listEl.classList.add('todo');
  listEl.id = generateID();
  listEl.draggable = true;
  listEl.innerHTML = `
    <div class="m-cover">
      <div class="mark-item ring">
        <input type="checkbox" id="${inputID}" class="chkboxes">
        <label for="${inputID}"></label> 
      </div>
    </div>  
    <p class="todo-txt">${todoMessage}</p> 
    <img src="./images/icon-cross.svg" alt="icon-cross">
  `;

  if (todo && todo.done) {
    listEl.classList.add('completed');
    let input = listEl.querySelector('input');
    input.checked = true;
  }

  ulElem.appendChild(listEl);

  const box = listEl.querySelector('.chkboxes');
  const remove = listEl.querySelector('img');
  box.addEventListener('click', () => toggleComplete(box));
  remove.addEventListener('click', () => deleteTodo(ulElem, listEl, box));
  listEl.addEventListener('dragstart', dragStart);
  listEl.addEventListener('dragend', dragEnd);

  input.value = '';
  inputID++;
  updateLS();
  updateTodosNum();
}

function updateLS() {
  const todos = [];

  const listItems = document.querySelectorAll('li');
  listItems.forEach(listItem => {
    const pTag = listItem.querySelector('p');
    const inputTag = listItem.querySelector('input');

    todos.push({
      text: pTag.innerText,
      done: inputTag.checked
    });
  });

  localStorage.setItem('todos', JSON.stringify(todos));
}

function toggleComplete(box) {
  const todo = box.parentElement.parentElement;
  todo.classList.toggle('completed');
  updateLS();
  updateTodosNum();
}

function deleteTodo(ul, li, chkbox) {
  chkbox.removeEventListener('click', () => toggleComplete(chkbox));
  ul.removeChild(li);
  updateLS();
  updateTodosNum();
}

function toggleLightMode() {
  const header = toggle.parentElement.parentElement;
  const container = document.querySelector('.content');
  const inputBg = container.querySelector('.add-todo');
  const btnsBg = container.querySelector('.btns-container');
  const body = document.body;

  const domsArray = [header, container, inputBg, btnsBg, body, ulElem, toggle];
  domsArray.forEach(dom => dom.classList.toggle('light'));
}

function getTodosArray(id) {
  let todos = [...document.querySelectorAll('li')];

  if (id) {
    todos = [...document.querySelectorAll(`li:not(#${id})`)];
  }

  return todos;
}

function filterHandler(cmd, currbtn, btnsArr) {
  const arr = [];
  const todos = getTodosArray();
  todos.forEach(todo => {
    todo.classList.add('hide');
    const completed = todo.querySelector('input').checked;
    cmd === 'completed' && completed ? arr.push(todo) :
      cmd === 'active' && !completed ? arr.push(todo) :
      cmd === 'all' ? arr.push(todo) : null;
  });

  for (let i = 0; i < arr.length; i++) {
    arr[i].classList.remove('hide');
  }

  for (let j = 0; j < btnsArr.length; j++) {
    btnsArr[j].classList.remove('active');
  }
  currbtn.classList.add('active');
  currbtn.scrollIntoView();
}

function clearCompleted() {
  const todos = getTodosArray();

  todos.forEach(todo => {
    const completedTask = todo.querySelector('input').checked;
    completedTask ? todo.remove() : null;
    updateLS();
    updateTodosNum();
  });
}

function updateTodosNum() {
  const numEl = document.getElementById('itemsNo');
  const todosArray = getTodosArray();
  const activeTodos = todosArray.filter(todo => {
    return !todo.classList.contains('completed');
  });

  numEl.innerText = activeTodos.length;
}

function generateID() {
  const chars = [
    getRandomLower(),
    getRandomUpper(),
    getRandomNumber(),
  ];
  let val = chars.join('');
  return val;
}

function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}


/* Drag & Drop Handlers */

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
  currentSelectors = this.className;
  this.classList.add('fade-out');

  setTimeout(() => this.className = 'hide', 0);
}

function dragEnd(e) {
  this.className = currentSelectors;
  currentSelectors = '';
}

function dragEnter(e) {
  e.preventDefault();
}

function dragOver(e) {
  e.preventDefault();
}

function dragLeave(e) {
  e.preventDefault();
}

function drop(e) {
  const id = e.dataTransfer.getData('text/plain');
  const todo = document.getElementById(`${id}`);

  const elem = getClosestElement(e.clientY, id);

  if (elem === null) {
    this.appendChild(todo);
  } else {
    this.insertBefore(todo, elem);
  }

  updateLS();
}

function getClosestElement(y, id) {
  const listEls = getTodosArray(id);

  const listEl = listEls.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY });

  return listEl.element;
}