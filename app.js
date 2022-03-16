// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const completeAllBtn = document.querySelector('.complete-all-btn');
const filterPanel = document.querySelector('.todo-filters');
let filtersList = document.querySelector('.todo-filters-list');
const clearCompletedBtn = document.querySelector('.todo-clear');


// Event Listeners
todoButton.addEventListener('click', onClick);
todoList.addEventListener('click', onDelete);
todoList.addEventListener('click', onCheck);
completeAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAllTodos(checkAllTodos, uncheckAllTodos);
});
clearCompletedBtn.addEventListener('click', clearCompleted);

let todosArr = [];

// Creating todo object
const createTodo = (text) => ({
    text,
    completed: false,
    id: new Date().getTime()
});

// Adding todo object in array
const addTodo = (inputValue) => {
    const newTodo = createTodo(inputValue);
    todosArr.push(newTodo);
}

// Deleting todo object from array
const deleteTodo = (id) => {
    todosArr = todosArr.filter((item) => item.id !== id);
}

// Checking todo object in array
const checkTodo = (id) => {
    todosArr.forEach((item) => {
        if(id === item.id && item.completed === false) {
            item.completed = true;
        } else if (id === item.id && item.completed === true) {
            item.completed = false;
        }
    });
}


// Rendering todo item
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
    completedBtn.setAttribute('data-complete', 'complete');
    // console.log(newTodo);
    // console.log(todosArr);
    if (completed) {
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
    trashBtn.setAttribute('data-trash', 'trash');
    newTodo.appendChild(trashBtn);
}

const countTodos = () => {
    return todosArr.length;
}

// Render all todo list
const renderTodos = () => {

    todoList.innerHTML = '';

    todosArr.forEach((item) => {
        renderTodoItem(item);
    });

    if (todosArr.length > 0) {
        completeAllBtn.style.display = 'block';
    } else {
        completeAllBtn.style.display = 'none';
    }

    if (todosArr.length !== 0) {
        filterPanel.style.visibility = 'visible';
    } else {
        filterPanel.style.visibility = 'hidden';
    }

    filterPanel.childNodes[1].innerText = `Total: ${countTodos()}`;
    console.log(todosArr);
}

// Event function on input
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

const findTodoId = (e) => {
    const target = e.target;
    const todo = target.parentElement;
    return +todo.getAttribute('data-id');
}

// Delete event handler function
function onDelete(e) {
    const id = findTodoId(e);

    console.log(id);

    if (e.target.dataset.trash !== 'trash' &&  e.target.dataset.clear !== 'clear-all') {
        return;
    }


    deleteTodo(id);
    renderTodos();
}

// Checking event handler function
function onCheck(e) {
    const id = findTodoId(e);

    if (!(e.target.dataset.complete === 'complete')) {
        return;
    }

    checkTodo(id);
    renderTodos();
}


function checkAllTodos() {

    todosArr.forEach((item) => {
        item.completed = true;
        renderTodos();
    });
    return 'checked';
}

function uncheckAllTodos() {

    todosArr.forEach((item) => {
        item.completed = false;
        renderTodos();
    })

    return 'unchecked';
}


function toggleAllTodos(checkFunc, uncheckFunc) {

    const everyUnchecked = todosArr.every((item) => !item.completed);
    const someChecked = todosArr.some((item) => item.completed);
    const everyChecked = todosArr.every((item) => item.completed);

    if (everyUnchecked) {
        console.log('everyUnchecked', everyUnchecked);
        checkFunc();
    } else if (everyChecked) {
        console.log('everyChecked', everyChecked);
        uncheckFunc();
    } else if (someChecked) {
        console.log('someChecked', someChecked);
        checkFunc();
    }
}


function clearCompleted() {
    todosArr = todosArr.filter((item) => !item.completed);
    renderTodos();
    console.log(todosArr);
}


// Creating buttons array


// function filterTodos(items, filter) {
//     console.log(typeof filter);
//     switch(filter) {
//         case 'active':
//             console.log('active')
//             items.filter((item) => !item.completed);
//             renderTodos();
//             break;
//         case 'completed':
//             console.log('completed')
//             items.filter((item) => item.completed);
//             renderTodos();
//         default:
//             return items;
//     }
// }

// function showCompleted() {
//     console.log("Show completed");
// }

// function onFilterSelect() {
//     filterTodos(todosArr, )
// }