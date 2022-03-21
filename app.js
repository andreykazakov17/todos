// Init variables
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const completeAllBtn = document.querySelector('.complete-all-btn');
const filterPanel = document.querySelector('.todo-filters');
const clearCompletedBtn = document.querySelector('.todo-clear');
let filtersList = document.querySelector('.todo-filters-list');
let todosArr = [];
const filterBtns = Object.values(filtersList.children);
let filter = 'all';


// Utils
const createTodo = (text) => ({
    text,
    completed: false,
    id: new Date().getTime()
});

const countTodos = () => {
    return todosArr.length;
}

const updateClassesArr = () => {
    return filterBtns.map((item) => {
        return item.classList.value;
    });
}

const deleteActiveClass = () => {
    for(let btn of Object.values(filtersList.children)) {
        btn.classList.remove('active-btn');
    }
}

const activeFilter = (e) => {
    if (e.target.tagName !== 'BUTTON') return;

    for(let btn of Object.values(filtersList.children)) {
        btn.classList.remove('active-btn');
    }
    

    console.log(filter);
    e.target.classList.add('active-btn');
    return e.target.dataset['btn'];
}

const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const clearLocalStorage = () => {
    localStorage.removeItem('todosArr');
}

const setLocalStorage = (key, data) => {
    const serializedArr = JSON.stringify(data);
    localStorage.setItem(key, serializedArr);
}


// Todo function with data
const filterTodos = (items, filter) => {
    switch (filter) {
        case "active":
            return items.filter((item) => !item.completed);
        case "completed":
            return items.filter((item) => item.completed);
        default:
            return items;
    }
}

const clearCompleted = () => {
    todosArr = todosArr.filter((item) => !item.completed);
}

const addTodo = (inputValue) => {
    const newTodo = createTodo(inputValue);
    todosArr.push(newTodo);
}

const deleteTodo = (id) => {
    todosArr = todosArr.filter((item) => item.id !== id);
}

const checkTodo = (id) => {
    return todosArr.map((item) => item.id === id ? { ...item, completed: !item.completed } : item);
    
}

const findTodoId = (e) => {
    const target = e.target;
    const todo = target.parentElement;
    return +todo.getAttribute('data-id');
}

const checkAllTodos = (todosArr) => {

    return todosArr.map((item) => {
        return {...item, completed: true}
    });
}

const uncheckAllTodos = (todosArr) => {
    
    return todosArr.map((item) => {
        return {...item, completed: false}
    });
}

const toggleAllTodos = () => {

    const everyUnchecked = todosArr.every((item) => !item.completed);
    const someChecked = todosArr.some((item) => item.completed);
    const everyChecked = todosArr.every((item) => item.completed);

    if (everyChecked) {
        todosArr = uncheckAllTodos(todosArr);
        return;
    }

    if (everyUnchecked || someChecked) {
        todosArr = checkAllTodos(todosArr);
        return;
    }
}

// Renders
const renderTodoItem = ({id, completed, text}) => {
    
    const newTodo = document.createElement('li');
    const textWrapper = document.createElement('div');
    const textDiv = document.createElement('div');
    const textInput = document.createElement('input');

    textInput.setAttribute('type', 'text');
    textInput.setAttribute('value', text);
    textInput.classList.add('todo-text');
    textInput.classList.add('hidden');

    newTodo.setAttribute("data-id", id);
    newTodo.classList.add('todo-item');

    textDiv.classList.add('todo-text');
    textDiv.innerText = text;

    textWrapper.classList.add('text-wrapper');
    textWrapper.appendChild(textDiv);
    textWrapper.appendChild(textInput);

    newTodo.appendChild(textWrapper);
    todoList.appendChild(newTodo);

    // Check button
    const completedBtn = document.createElement('button');
    completedBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    completedBtn.classList.add('complete-btn');
    completedBtn.setAttribute('data-complete', 'complete');
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

const renderToggleIcon = (todosArr) => {
    if (todosArr.length) {
        completeAllBtn.style.display = '';
        filterPanel.style.visibility = 'visible';
    } else {
        completeAllBtn.style.display = 'none';
        filterPanel.style.visibility = 'hidden';
    }
}

const renderTodoCounter = () => {
    filterPanel.childNodes[1].innerText = `Total: ${countTodos()}`;
}

const renderTodos = () => {

    todoList.innerHTML = '';
    filterTodos(todosArr, filter).forEach((item) => {
        renderTodoItem(item);
    });
}

const render = () => {
    renderToggleIcon(todosArr);
    renderTodos();
    renderTodoCounter();
}


// Handlers
const onFiltersHandler = (e) => {
    filter = activeFilter(e);
    render();
}

const onClickHandler = (e) => {
    e.preventDefault();

    if (todoInput.value === '') {
        return;
    }

    addTodo(todoInput.value);
    todoInput.value = '';
    render();
}



const onDeleteHandler = (e) => {
    const id = findTodoId(e);

    if (e.target.dataset.trash !== 'trash' &&  e.target.dataset.clear !== 'clear-all') {
        return;
    }

    deleteTodo(id);
    
    render();
    if(todosArr.length === 0) {
        console.log('clearLocalStorage');
        clearLocalStorage();
    }
}


const onCheckHandler = (e) => {
    const id = findTodoId(e);

    if (!(e.target.dataset.complete === 'complete')) {
        return;
    }

    todosArr = checkTodo(id);
    render();
}

const handleClear = () => {
    clearCompleted();
    render();
    clearLocalStorage();
}


// Event Listeners
todoButton.addEventListener('click', onClickHandler);
todoList.addEventListener('click', onDeleteHandler);
todoList.addEventListener('click', (e) => {
    onCheckHandler(e);
    setLocalStorage('todosArr', todosArr);
});
completeAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAllTodos();
    render();
});
clearCompletedBtn.addEventListener('click', handleClear);
filtersList.addEventListener('click', (e) => {
    onFiltersHandler(e);
});
todoButton.addEventListener('click', () => {
    setLocalStorage('todosArr', todosArr);
});
document.addEventListener('DOMContentLoaded', () => {

    todosArr = getLocalStorage('todosArr') || [];
    render();
});
window.addEventListener('unload', () => {
    if (localStorage.getItem('todosArr') === '[]') {
        clearLocalStorage();
    }
});


// ---- Input Text Updating

const updateTextHandler = (e) => {
    updateInput(e);
}

const updateInput = (e) => {
    const target = e.target;

    if (target.tagName !== 'LI' && target.tagName !== 'DIV') return;

    const textWrapper = target.parentElement;
    const textDiv = textWrapper.firstChild;
    const textInput = textWrapper.lastChild;
    const valueLength = textInput.value.length;
    const id = +textWrapper.parentElement.dataset['id'];

    textDiv.classList.add('hidden');
    textInput.classList.remove('hidden');
    textInput.focus();
    textInput.setSelectionRange(valueLength, valueLength);
    
    textInput.onchange = function() {

        if (textInput.value === '') return;

        todosArr = todosArr.map((item) => item.id === id ? { ...item, text: textInput.value } : item);
        setLocalStorage('todosArr', todosArr);
        render();
    }

    textInput.onblur = function() {
        render();
    }
}

todoList.addEventListener('dblclick', updateTextHandler);