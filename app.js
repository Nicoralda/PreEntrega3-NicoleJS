// Función para agregar una fila a una tabla
function addRowToTable(tableId, transaction) {
    const table = document.getElementById(tableId);
    const newRow = table.insertRow(-1);

    const cells = ["tipo", "descripcion", "monto"];
    cells.forEach(cell => {
        const newCell = newRow.insertCell();
        newCell.textContent = transaction[cell];
    });
}

// Función para "manejar" el envío de un formulario
function handleFormSubmit(formId, tableId) {
    const form = document.getElementById(formId);
    const table = document.getElementById(tableId);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Sacar los datos del formulario
        const formData = new FormData(form);
        const newTransaction = {
            tipo: formData.get('tipo'),
            descripcion: formData.get('descripcion'),
            monto: formData.get('monto'),
        };

        // Agregar la nueva transacción al localStorage
        const transactions = JSON.parse(localStorage.getItem(tableId)) || [];
        transactions.push(newTransaction);
        localStorage.setItem(tableId, JSON.stringify(transactions));

        // Agregar la nueva fila a la tabla
        addRowToTable(tableId, newTransaction);

        // Limpiar el formulario
        form.reset();
    });
}

// Asociar las funciones a cada formulario
handleFormSubmit("formularioIngresos", "tablaTransaccionesIngresos");
handleFormSubmit("formulario", "tablaTransacciones"); 
handleFormSubmit("formularioGastos", "tablaTransaccionesGastos");

// Función para cargar transacciones desde el localStorage
function loadTransactions(tableId) {
    const transactions = JSON.parse(localStorage.getItem(tableId)) || [];
    transactions.forEach(transaction => addRowToTable(tableId, transaction));
}

// Cargar las transacciones al cargar la página
window.onload = () => {
    loadTransactions("tablaTransaccionesIngresos");
    loadTransactions("tablaTransacciones");
    loadTransactions("tablaTransaccionesGastos");
};
