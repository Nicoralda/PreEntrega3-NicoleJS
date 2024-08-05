const form = document.getElementById("formulario");
const transactionTable = document.getElementById("tablaTransacciones");

// Función para agregar una nueva fila a la tabla

function addTransactionRow(transaction) {
    const newRow = transactionTable.insertRow(-1);

    const cells = ["tipo", "descripcion", "categoria", "monto"];
    cells.forEach(cell => {
        const newCell = newRow.insertCell();
        newCell.textContent = transaction[cell];
    });
}

// Función para cargar las transacciones desde el localStorage

function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(addTransactionRow);
}

// Evento al enviar el formulario

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener los datos del formulario
    const formData = new FormData(form);
    const newTransaction = {
        tipo: formData.get('tipo'),
        descripcion: formData.get('descripcion'),
        categoria: formData.get('categoria'),
        monto: formData.get('monto'),
    };

    // Agregar la nueva transacción al array y al localStorage
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Agregar la nueva fila a la tabla
    addTransactionRow(newTransaction);

    // Limpiar el formulario
    form.reset();
});

// Cargar las transacciones al cargar la página

window.onload = loadTransactions;
