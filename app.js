// Init variables
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const completeAllBtn = document.querySelector('.complete-all-btn');
const filterPanel = document.querySelector('.todo-filters');
const clearCompletedBtn = document.querySelector('.todo-clear');
const parsedArr = JSON.parse(localStorage.getItem('todosArr'));
let filtersList = document.querySelector('.todo-filters-list');
let todosArr = [];
const filterBtns = Object.values(filtersList.children);
let filter = 'all';


// let classesArr = filterBtns.map((item) => {
//     return item.classList.value;
// });

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


// Todo function with data
const filterTodos = (items, filter) => {
    switch (filter) {
        case "active":
            console.log('active');
            return items.filter((item) => !item.completed);
        case "completed":
            console.log('completed');
            return items.filter((item) => item.completed);
        default:
            console.log('all');
            return items;
    }
}

const clearCompleted = () => {
    todosArr = todosArr.filter((item) => !item.completed);
    render();
    setLocalStorage();
    console.log(todosArr);
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
        todosArr = checkAllTodos(todosArr);
        return;
    }
}

// Renders
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

const renderToggleIcon = (todosArr) => {
    //console.log(todosArr);
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

const renderTodoCounter = () => {
    filterPanel.childNodes[1].innerText = `Total: ${countTodos()}`;
}

const renderTodos = () => {

    todoList.innerHTML = '';
    todosArr.forEach((item) => {
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
    
    todoList.innerHTML = '';
    filterTodos(todosArr, filter).forEach((item) => {
        renderTodoItem(item);
    })
    //console.log(todosArr);
    //return filterTodos(todosArr, filter);
}

const onClickHandler = (e) => {
    e.preventDefault();

    let classesArr = updateClassesArr();
    // console.log(todosArr);
    //console.log(classesArr);

    if (todoInput.value !== '' && classesArr[2] === 'todo-filters-item active-btn') {
        console.log('Completed');
        addTodo(todoInput.value);
    } else if (todoInput.value !== '' && classesArr[1] === 'todo-filters-item active-btn') {
        addTodo(todoInput.value);
        console.log('Active');
        renderTodoItem(todosArr[todosArr.length - 1]);
    } else if (todoInput.value !== '' && !(classesArr[1] === 'todo-filters-item active-btn')) {
        addTodo(todoInput.value);
        render();
        
        // todosArr.forEach((item) => {
        //     if(!item.completed) {
        //         renderTodoItem(item);
        //     }
        // })
        
    } 

    todoInput.value = '';
}



const onDeleteHandler = (e) => {
    const id = findTodoId(e);
    let classesArr = updateClassesArr();

    if (e.target.dataset.trash !== 'trash' &&  e.target.dataset.clear !== 'clear-all') {
        return;
    }

    deleteTodo(id);
    setLocalStorage();
    render();
}


const onCheckHandler = (e) => {
    const id = findTodoId(e);
    let classesArr = updateClassesArr();

    if (!(e.target.dataset.complete === 'complete')) {
        return;
    }

    todosArr = checkTodo(id);
    console.log('render');

    render();

    // if (classesArr[2] === 'todo-filters-item active-btn') {

    //     todosArr = checkTodo(id);
    //     todoList.innerHTML = '';
    //     todosArr.forEach((item) => {
    //         if (item.completed) {
    //             renderTodoItem(item);
    //         } else {


    //             //renderTodoItem(item);
    //             deleteActiveClass();
    //             //filtersList.children[0].classList.add('active-btn');
                

    //         }
    //     });
        
       

    // } else if (classesArr[1] === 'todo-filters-item active-btn') {
    //     todosArr = checkTodo(id);
    //     todoList.innerHTML = '';
    //     todosArr.forEach((item) => {
    //         if (!item.completed) {
    //             renderTodoItem(item);
    //         }
    //     });
    // } else {
    //     todosArr = checkTodo(id);
    //     render();
    // }
}

// const onFiltersHandler = (e) => {
//     if (e.target.tagName !== 'BUTTON') return;
//     todoList.innerHTML = '';
//     const filterDataset = e.target.dataset['btn'];

//     for(let btn of Object.values(filtersList.children)) {
//         btn.classList.remove('active-btn');
//     }

//     todosArr.forEach((item) => {
        
//         if (filterDataset === 'completed' && item.completed) {
//             e.target.classList.add('active-btn');
//             console.log(todosArr);
//             renderTodoItem(item);
//         } else if (filterDataset === 'active' && !item.completed) {
//             e.target.classList.add('active-btn');
//             //console.log(todosArr);
//             renderTodoItem(item);
//             //renderTodos();
//         } else if (filterDataset === 'all') {
//             e.target.classList.add('active-btn');
//             //console.log(todosArr);
//             renderTodos();
//         }

//     });
// }


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




// -----Local Storage


todoButton.addEventListener('click', setLocalStorage);
document.addEventListener('DOMContentLoaded', () => {

    if(parsedArr) {
        todosArr = parsedArr;
    }
    renderTodoCounter();
    renderToggleIcon(todosArr);
    getLocalStorage(localStorage.getItem('todosArr'));
});


function getLocalStorage(arr) {
    if(localStorage.getItem('todosArr') === arr && localStorage.getItem('todosArr') !== null) {
        //console.log(localStorage.getItem('todosArr').length);
        todosArr = parsedArr;
        todosArr.forEach((item) => {
            renderTodoItem(item);
        })
    }
}


function setLocalStorage() {
    const serializedArr = JSON.stringify(todosArr);
    localStorage.setItem('todosArr', serializedArr);
    //console.log(serializedArr);

    if(localStorage.getItem('todosArr') === '[]') {
        localStorage.removeItem('todosArr');
    }
}