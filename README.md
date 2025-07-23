# ToDo  Web Application  
[Live Demo](https://17hrishi.github.io/ToDo/)  

---
## Description  
The To Do Web Application is a simple and intuitive tool that helps users manage their daily tasks. It allows adding, updating, and deleting tasks with ease.  

---
## Features  
- Add, edit, and delete tasks.  
- Mark tasks as completed.  
- User-friendly interface.  

---
## Technologies Used  
- HTML  
- CSS  
- JavaScript  


---
## html
```
<body>
  <header class="banner">
    <div class="banner-content">
      <h1 class="logo">ToDo</h1>
	  <img style="height:25px; weight:25px" src="./images/icon-sun.svg" alt="icon-sun" id="toggle">
    </div>
  </header>

  <section class="content">
    <div class="container">
      <form id="form">
        <div class="add-todo">
          <div class="ring"></div>
          <input type="text" id="input" class="input" autocomplete="off" placeholder="Create a new Task...">
        </div>

        <ul class="todos" id="todos"></ul>
        <div class="btns-container">
          <small><span id="itemsNo">0</span> items left</small>
          <div class="btns">
            <button class="btn active" id="all">All</button>
            <button class="btn" id="active">Active</button>
            <button class="btn" id="completed">Completed</button>
          </div>
          <button class="clear btn" id="clear-btn">Clear Completed</button>
        </div>
      </form>
    </div>
    <small class="info">Drag and drop to reorder list</small>
  </section>
</body>
```

## js
```
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
  { text: 'C course', done: true },
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
```
## css
```
@media screen and (max-height: 768px) {
  .banner-content {
    padding-top: 20px;
  }

  .container {
    top: -90px;
  }
}

@media screen and (max-height: 600px) {
  .container {
    top: -40px;
  }
}

@media (hover: hover) and (pointer: fine) {
  .btn:hover {
    color: var(--txt-col-lgt);
  }

  .btns-container.light .btn:hover {
    color: var(--txt-col-drk);
  }

  .mark-item:hover {
    border: none;
    cursor: pointer;
  }

  .mark-item:hover::before {
    content: '';
    position: absolute;
    border-radius: 100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(var(--pri-grad-one), var(--pri-grad-two));
    z-index: -100;
    cursor: pointer;
  }

  .todos.light .mark-item:hover::before {
    background: linear-gradient(var(--pri-grad-one), var(--pri-grad-two));
  }

  .mark-item:hover::after {
    content: '';
    position: absolute;
    margin: 1px auto;
    width: 90%;
    height: 90%;
    border-radius: 100%;
    background-color: var(--todo-bg-drk);
    cursor: pointer;
  }

  .todos.light .mark-item:hover::after {
    background-color: var(--todo-bg-lgt);
  }
}
```
---
### Created by Hrishikesh
---
