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
    if(localStorage.getItem(key) && localStorage.getItem('todosArr') !== null) {
        todosArr = parsedArr;
    }
}

const clearLocalStorage = () => {
    localStorage.removeItem('todosArr');
}

const setLocalStorage = () => {
    const serializedArr = JSON.stringify(todosArr);
    localStorage.setItem('todosArr', serializedArr);
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
    render();
    clearLocalStorage();
}

const addTodo = (inputValue) => {
    const newTodo = createTodo(inputValue);
    todosArr.push(newTodo);
}

const deleteTodo = (id) => {
    todosArr = todosArr.filter((item) => item.id !== id);
}

const checkTodo = (id) => {
    // return todosArr.map((item) => {
    //     if(id === item.id && !item.completed) {
    //         return {...item, completed: true}
    //     } else if (id === item.id && item.completed) {
    //         return {...item, completed: false}
    //     }
    //     console.log(todosArr);
    // })
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
    const textInput = document.createElement('input');

    textInput.setAttribute('type', 'text');
    textInput.setAttribute('value', text);
    textInput.setAttribute('placeholder', text);
    textInput.classList.add('text-input');
    textInput.setAttribute('onmousedown', 'return false');

    newTodo.setAttribute("data-id", id);
    //newTodo.innerText = text;
    newTodo.classList.add('todo-item');
    newTodo.appendChild(textInput);
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
        completeAllBtn.style.display = 'block';
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
        console.log(todosArr);
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


// Event Listeners
todoButton.addEventListener('click', onClickHandler);
todoList.addEventListener('click', onDeleteHandler);
todoList.addEventListener('click', (e) => {
    onCheckHandler(e);
    setLocalStorage();
});
completeAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAllTodos();
    render();
});
clearCompletedBtn.addEventListener('click', clearCompleted);
filtersList.addEventListener('click', (e) => {
    onFiltersHandler(e);
});
todoButton.addEventListener('click', setLocalStorage);
document.addEventListener('DOMContentLoaded', () => {
    const parsedArr = JSON.parse(localStorage.getItem('todosArr'));

    if(parsedArr) {
        todosArr = parsedArr;
    }
    
    getLocalStorage(localStorage.getItem('todosArr'));
    render();
});


// ---- Input Text Updating

const updateTextHandler = (e) => {
    updateInput(e);
}

const moveCaretToEnd = (inputObject) => {
    if (inputObject.selectionStart)
    {
     let end = inputObject.value.length;
     inputObject.setSelectionRange(end,end);
     inputObject.focus();
    }
}


const updateInput = (e) => {
    const target = e.target;
    const valueLength = target.value.length;
    const id = +e.target.parentElement.dataset['id'];
    console.log(target.value);

    if (target.tagName !== 'LI' && target.tagName !== 'INPUT') return;

    target.setAttribute('onmousedown', 'return true');
    target.focus();
    target.setSelectionRange(valueLength, valueLength);
    const elem = todosArr.find((item) => item.id === id);

    console.log(target.value);

    target.onchange = function() {
        elem.text = target.value;
        console.log(todosArr);
        setLocalStorage();
        render();
    }
    
    target.onblur = function() {
        if(target.value === elem.text) {
            target.setAttribute('onmousedown', 'return false');
        }
    }
}
todoList.addEventListener('dblclick', updateTextHandler);