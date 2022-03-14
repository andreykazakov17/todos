// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');

// Event Listeners
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheckTodo);

// Functions
function addTodo(e) {
    e.preventDefault();
    
    const todoWrapper = document.createElement('div');
    todoWrapper.classList.add('todo');

    const newTodo = document.createElement('li');
    if (todoInput.value === '') {
        return;
    }
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    todoWrapper.appendChild(newTodo);

    // Check button
    const completedBtn = document.createElement('button');
    completedBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    completedBtn.classList.add('complete-btn');
    todoWrapper.prepend(completedBtn);

    // Trash button
    const trashBtn = document.createElement('button');
    trashBtn.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    trashBtn.classList.add('trash-btn');
    todoWrapper.appendChild(trashBtn);

    // Append to list
    todoList.appendChild(todoWrapper);

    todoInput.value = '';
}

function deleteCheckTodo(e) {
    const target = e.target;
    console.log(target.parentElement);
    console.log(target.classList[0]);

    if (target.classList[0] === 'trash-btn') {
        const todo = target.parentElement;
        todo.remove();
    }

    if (target.classList[0] === 'complete-btn') {
        const todo = target.parentElement;
        target.classList.toggle('checked');
        todo.classList.toggle('completed');
    }
}