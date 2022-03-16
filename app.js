// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const completeAllBtn = document.querySelector('.complete-all-btn');
const filterPanel = document.querySelector('.todo-filters');
let filtersList = document.querySelector('.todo-filters-list');
const clearCompletedBtn = document.querySelector('.todo-clear');


// Event function on input
const onClickHandler = (e) => {
    e.preventDefault();


    const target = e.target;
    const id = target.parentElement.getAttribute('data-id');

    if (todoInput.value !== '') {
        addTodo(todoInput.value);
        render();
    }
    todoInput.value = '';
}

const onDeleteHadler = (e) => {
    const id = findTodoId(e);

    console.log(id);

    if (e.target.dataset.trash !== 'trash' &&  e.target.dataset.clear !== 'clear-all') {
        return;
    }

    deleteTodo(id);
    render();
}

const onCheckHadler = (e) => {
    const id = findTodoId(e);

    if (!(e.target.dataset.complete === 'complete')) {
        return;
    }

    todosArr = checkTodo(id);
    render();
}

const clearCompleted = () => {
    todosArr = todosArr.filter((item) => !item.completed);
    render();
    console.log(todosArr);
}

// Event Listeners
todoButton.addEventListener('click', onClickHandler);
todoList.addEventListener('click', onDeleteHadler);
todoList.addEventListener('click', onCheckHadler);
completeAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAllTodos();
    render();
});
clearCompletedBtn.addEventListener('click', clearCompleted);

let todosArr = [];

const createTodo = (text) => ({
    text,
    completed: false,
    id: new Date().getTime()
});

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

const renderTodos = () => {

    todoList.innerHTML = '';
    todosArr.forEach((item) => {
        renderTodoItem(item);
    });
}

const renderTodoCounter = () => {
    filterPanel.childNodes[1].innerText = `Total: ${countTodos()}`;
}

const renderToggleIcon = (todosArr) => {
    console.log(todosArr);
    if (todosArr.length) {
        completeAllBtn.style.display = 'block';
    } else {
        completeAllBtn.style.display = 'none';
    }

    if (todosArr.length !== 0) {
        filterPanel.style.visibility = 'visible';
    } else {
        filterPanel.style.visibility = 'hidden';
    }
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

// const uncheckAllTodos = (todosArr) => 
//     retutodosArr.map((item) => ({...item, completed: false})
// );

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
        console.log("call");
        todosArr = checkAllTodos(todosArr);
        return;
    }
}

// Total render
const render = () => {
    renderToggleIcon(todosArr);
    renderTodos();
    renderTodoCounter();
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