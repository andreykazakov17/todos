// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');

// Event Listeners
todoButton.addEventListener('click', onClick);
todoList.addEventListener('click', onCheckDelete);

let todosArr = [];

// Создание объекта todo
const createTodo = (text) => ({
    text,
    completed: false,
    id: new Date().getTime(),
    active: true
});

// Добавление объекта todo в массив
const addTodo = (inputValue) => {
    const newTodo = createTodo(inputValue);
    todosArr.push(newTodo);
}

// Рендер todo item
const renderTodoItem = ({id, completed, text}) => {
    
    const newTodo = document.createElement('li');

    newTodo.setAttribute("data-id", id);
    newTodo.innerText = text;
    newTodo.classList.add('todo-item');
    todoList.appendChild(newTodo);

    // Check button
    const completedBtn = document.createElement('button');
    completedBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    completedBtn.classList.add('complete-btn');
    console.log(newTodo);
    console.log(todosArr);
    if (completed === true) {
        newTodo.classList.add('checked');
        newTodo.classList.add('completed');
    } else {
        newTodo.classList.remove('checked');
        newTodo.classList.remove('completed');
    }
    newTodo.prepend(completedBtn);

    // Trash button
    const trashBtn = document.createElement('button');
    trashBtn.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    trashBtn.classList.add('trash-btn');
    newTodo.appendChild(trashBtn);
}

// Рендер всего списка todo
const renderTodos = () => {

    todoList.innerHTML = '';

    todosArr.forEach((item) => {
        if (item.active !== false) {
            renderTodoItem(item);
        }
    });
}


function onClick(e) {
    e.preventDefault();

    const target = e.target;
    const id = target.parentElement.getAttribute('data-id');

    if (todoInput.value !== '') {
        addTodo(todoInput.value);
        renderTodos();
    }
    todoInput.value = '';
    
}

// Функция обработки ивента отметки / удаления
function onCheckDelete(e) {
    const target = e.target;
    const todo = target.parentElement;
    const id = +todo.getAttribute('data-id');

    console.log(target.classList.value === 'trash-btn');

    todosArr.forEach((item) => {
        if(id === item.id && item.completed === false && target.classList.value === 'complete-btn') {
            item.completed = true;
            renderTodos();
        } else if (id === item.id && item.completed === true && target.classList.value === 'complete-btn') {
            item.completed = false;
            renderTodos();
        } else if (id === item.id && target.classList.value === 'trash-btn') {
            item.active = false;
            renderTodos();
        }
    });
}

// Удаление задачи
function deleteTodo(id) {

    const index = todosArr.find((item) => item.id === id);
    const deletedItem = todosArr.splice(index, 1);
    console.log(deletedItem);
}