# Calculadora de Gastos

Este proyecto es una aplicación para la gestión de un presupuesto. Los usuarios pueden ingresar su presupuesto inicial y añadir gastos, los cuales se descontarán del presupuesto restante. La aplicación permite visualizar el presupuesto total, el presupuesto restante y administrar los gastos agregados.

## DEMO
Puedes ver una demostración de la aplicación [aquí](https://calculadoradegastos.netlify.app/).

## Características

- **Presupuesto Inicial:** Solicita al usuario el presupuesto inicial al cargar la página.
- **Añadir Gastos:** Permite al usuario agregar gastos con nombre y cantidad.
- **Eliminar Gastos:** Permite eliminar gastos de la lista.
- **Actualizar Presupuesto Restante:** Calcula y muestra el presupuesto restante después de agregar o eliminar un gasto.
- **Alertas Visuales:** Muestra alertas al usuario en caso de errores y al realizar acciones exitosas.
- **Indicadores de Presupuesto:** Cambia el color del presupuesto restante según el porcentaje de gasto (verde, amarillo, rojo).

## Código

### Variables y Selectores

Definimos los selectores para el formulario de agregar gasto y la lista de gastos.

```javascript
const form = document.querySelector('#agregar-gasto');
const expenseList = document.querySelector('#gastos ul');
```

### Eventos

Agregamos los event listeners para cargar el presupuesto al iniciar la página y para agregar nuevos gastos al formulario.

```javascript
eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget);
    form.addEventListener('submit', addExpense);
}
```

### Clases

#### Clase `Budget`

La clase `Budget` maneja el presupuesto total, el presupuesto restante y los gastos.

```javascript
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
        const spent = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        this.remaining = this.budget - spent;
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
    }
};
```

#### Clase `UserInterface`

La clase `UserInterface` maneja las interacciones con el DOM, como insertar el presupuesto, mostrar alertas, agregar gastos a la lista y actualizar el presupuesto restante.

```javascript
class UserInterface {
    insertBudget(amount) {
        const { budget, remaining } = amount;
        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = remaining;
    }

    printAlert(message, type) {
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert');
        divMessage.classList.add(type === 'error' ? 'alert-danger' : 'alert-success');
        divMessage.textContent = message;

        document.querySelector('.primario').insertBefore(divMessage, form);
        setTimeout(() => {
            divMessage.remove();
        }, 2000);
    }

    addExpenseList(expenses) {
        this.clearHTML();
        expenses.forEach(expense => {
            const { amount, name, id } = expense;
            const newExpense = document.createElement('li');
            newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';
            newExpense.dataset.id = id;
            newExpense.innerHTML = `
                ${name} <span class='badge badge-primary badge-pill'>$ ${amount}</span>`;

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-danger', 'borrar-gasto');
            deleteBtn.innerHTML = 'Borrar &times';
            deleteBtn.onclick = () => {
                deleteExpense(id);
            }
            newExpense.appendChild(deleteBtn);

            expenseList.appendChild(newExpense);
        });
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
```

### Instancias y Variables

Instanciamos la interfaz de usuario y definimos la variable del presupuesto.

```javascript
const ui = new UserInterface();
let budget;
```

### Funciones

#### `askBudget`

Solicita al usuario el presupuesto inicial y lo valida. Si es válido, crea una instancia de `Budget` y actualiza el DOM.

```javascript
function askBudget() {
    const userBudget = prompt('Cuál es tu presupuesto?');

    if (userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0) {
        window.location.reload();
    }

    budget = new Budget(userBudget);
    ui.insertBudget(budget);
}
```

#### `addExpense`

Añade un nuevo gasto al presupuesto y actualiza el DOM con los gastos y el presupuesto restante.

```javascript
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

    const expense = { name, amount, id: Date.now() };

    budget.addNewExpense(expense);

    ui.printAlert('Gasto añadido correctamente', 'correcto');

    const { expenses, remaining } = budget;
    ui.addExpenseList(expenses);
    ui.updateRemaining(remaining);
    ui.checkBudget(budget);

    form.reset();
}
```

#### `deleteExpense`

Elimina un gasto del presupuesto y actualiza el DOM.

```javascript
function deleteExpense(id) {
    budget.deleteExpense(id);

    const { expenses, remaining } = budget;
    ui.addExpenseList(expenses);
    ui.updateRemaining(remaining);
    ui.checkBudget(budget);
}
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerencias o mejoras.
