// VARIABLES Y SELECTORES

const form = document.querySelector('#agregar-gasto');
const expenseList = document.querySelector('#gastos ul');

// EVENTOS

eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget);
    form.addEventListener('submit', addExpense);
}

// CLASES

class Budget {
    constructor(budget) {
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }

    addNewExpense(expense) {
        this.expenses = [...this.expenses, expense];
        this.calculateRemaining();
    }

    calculateRemaining() {
        const spent = this.expenses.reduce((total, expense) => total + expense.amount, 0); // itera los gastos y los acumula en un total 
        this.remaining = this.budget - spent;
        
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
    }
};

class UserInterface {
    insertBudget(amount) {
        const { budget, remaining } = amount;
        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = remaining;
    }

    printAlert(message, type) {
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert');

        if (type === 'error') {
            divMessage.classList.add('alert-danger')
        } else {
            divMessage.classList.add('alert-success')
        }
        divMessage.textContent = message;

        // INSERTAR EN EL HTML
        document.querySelector('.primario').insertBefore(divMessage, form);

        // QUITARLO LUEGO DE 2 SEGUNDOS
        setTimeout(() => {
            divMessage.remove();
        }, 2000)
    }

    addExpenseList(expenses) {
        this.clearHTML();
        expenses.forEach(expense => {
            const { amount, name, id } = expense;

            // CREAR LI
            const newExpense = document.createElement('li');
            newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';

            // nuevoGasto.setAttribute('data-id', id);
            newExpense.dataset.id = id;

            // AGREGAR HTML DEL GASTO
            newExpense.innerHTML = `
            ${name} <span class='badge badge-primary badge-pill'>$ ${amount}</span>`;

            // BORRAR EL GASTO
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-danger', 'borrar-gasto');
            deleteBtn.innerHTML = 'Borrar &times';
            deleteBtn.onclick = () => {
                deleteExpense(id);
            }
            newExpense.appendChild(deleteBtn);

            // AGREGAR AL HTML 
            expenseList.appendChild(newExpense);
        })
    }

    clearHTML() {
        while (expenseList.firstChild) {
            expenseList.removeChild(expenseList.firstChild);
        }
    }

    updateRemaining(remaining) {
        document.querySelector('#restante').textContent = remaining;
    }

    checkBudget(budgetObj) {
        const { budget, remaining } = budgetObj;

        const remainingDiv = document.querySelector('.restante');

        // COMPROBAR 25%
        if ((budget / 4) > remaining) {
            remainingDiv.classList.remove('alert-success', 'alert-warning');
            remainingDiv.classList.add('alert-danger');
        } else if ((budget / 2) > remaining) {
            remainingDiv.classList.remove('alert-success');
            remainingDiv.classList.add('alert-warning');
        } else {
            remainingDiv.classList.remove('alert-danger', 'alert-warning');
            remainingDiv.classList.add('alert-success');
        }
    }
}

// INSTANCIAR

const ui = new UserInterface();
let budget;

// FUNCIONES

function askBudget() {
    const userBudget = prompt('Cuál es tu presupuesto?');

    if (userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0) {
        window.location.reload();
    }

    // PRESUPUESTO VÁLIDO
    budget = new Budget(userBudget);

    ui.insertBudget(budget);
}

function addExpense(e) {
    e.preventDefault();

    const name = document.querySelector('#gasto').value;
    const amount = Number(document.querySelector('#cantidad').value);

    if (name === '' || amount === '') {
        ui.printAlert('Ambos campos son obligatorios', 'error');
        return;
    } else if (amount <= 0 || isNaN(amount)) {
        ui.printAlert('La cantidad ingresada no es válida', 'error');
        return;
    }

    // OBJETO GASTO
    const expense = { name, amount, id: Date.now() };

    budget.addNewExpense(expense);

    ui.printAlert('Gasto añadido correctamente', 'correcto');

    // IMPRIMIR LOS GASTOS
    const { expenses, remaining } = budget;
    ui.addExpenseList(expenses);

    ui.updateRemaining(remaining);

    ui.checkBudget(budget);

    form.reset();
}

function deleteExpense(id) {
    // ELIMINAR GASTOS DE LA CLASE
    budget.deleteExpense(id);

    // ELIMINAR GASTOS DEL HTML
    const { expenses, remaining } = budget;
    ui.addExpenseList(expenses);
    ui.updateRemaining(remaining);
    ui.checkBudget(budget);
}
