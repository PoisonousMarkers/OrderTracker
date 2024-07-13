let currentTable = null;
let orders = {};

// Load orders from localStorage if available
if (localStorage.getItem('restaurantOrders')) {
    orders = JSON.parse(localStorage.getItem('restaurantOrders'));
}

// Function to save orders to localStorage
function saveOrdersToLocalStorage() {
    localStorage.setItem('restaurantOrders', JSON.stringify(orders));
}

function selectTable(tableNumber) {
    currentTable = tableNumber;
    if (!orders[currentTable]) {
        orders[currentTable] = [];
    }
    showMenu();
    updateOrderSummary();
    updateTableButtonColor(currentTable);
}

function addMenuItem(menuItem) {
    if (currentTable !== null) {
        let found = false;

        // Check if the item is already in the order
        orders[currentTable].forEach(order => {
            if (order.item === menuItem) {
                found = true;
                order.quantity++; // Increment quantity if item already exists
            }
        });

        // If not found, add it as a new item
        if (!found) {
            orders[currentTable].push({ item: menuItem, quantity: 1, submitted: false });
        }

        updateOrderSummary();
        updateTableButtonColor(currentTable);
        saveOrdersToLocalStorage();
    } else {
        alert('Please select a table first.');
    }
}

function removeMenuItem(itemIndex) {
    if (currentTable !== null) {
        if (orders[currentTable][itemIndex].submitted) {
            if (!confirm('This item has been submitted. Are you sure you want to remove it?')) {
                return;
            }
        } else {
            if (!confirm('Are you sure you want to remove this item?')) {
                return;
            }
        }

        if (orders[currentTable][itemIndex].quantity > 1) {
            orders[currentTable][itemIndex].quantity--;
        } else {
            orders[currentTable].splice(itemIndex, 1);
        }
        
        updateOrderSummary();
        updateTableButtonColor(currentTable);
        saveOrdersToLocalStorage();
    }
}

function updateOrderSummary() {
    const summary = document.getElementById('summary');
    if (currentTable !== null) {
        summary.innerHTML = `Table ${currentTable}:<br>`;
        orders[currentTable].forEach((order, index) => {
            if (order.quantity > 1) {
                summary.innerHTML += `<button class="order-item ${order.submitted ? 'submitted' : ''}" onclick="removeMenuItem(${index})">${order.item} (${order.quantity})</button><br>`;
            } else {
                summary.innerHTML += `<button class="order-item ${order.submitted ? 'submitted' : ''}" onclick="removeMenuItem(${index})">${order.item}</button><br>`;
            }
        });
    }
    updateTableButtonColor(currentTable);
}

function showTables() {
    document.getElementById('page-tables').style.display = 'block';
    document.getElementById('page-menu').style.display = 'none';
}

function showMenu() {
    document.getElementById('page-tables').style.display = 'none';
    document.getElementById('page-menu').style.display = 'block';
}
function showCategory(category) {
    // Hide all menu items divs first
    document.getElementById('menu-items-starters').style.display = 'none';
    document.getElementById('menu-items-pasta').style.display = 'none';
    document.getElementById('menu-items-pizza').style.display = 'none';
    document.getElementById('menu-items-desserts').style.display = 'none';
    document.getElementById('menu-items-modifiers').style.display = 'none';

    // Show the selected category menu items
    document.getElementById(`menu-items-${category}`).style.display = 'block';

    // Toggle active class for menu category buttons
    const categoryButtons = document.querySelectorAll('#menu-categories button');
    categoryButtons.forEach(button => {
        if (button.getAttribute('data-category') === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}


function submitOrder() {
    if (currentTable !== null) {
        // Mark all items as submitted
        orders[currentTable].forEach(order => order.submitted = true);
        updateOrderSummary();
        updateTableButtonColor(currentTable);
        saveOrdersToLocalStorage();
        document.getElementById('clearTableBtn').style.display = 'inline-block'; // Show clear table button
        alert('Order submitted!');
        // Navigate back to table selection
        showTables();
    } else {
        alert('Please select a table first.');
    }
}

function clearTable() {
    if (currentTable !== null) {
        if (confirm('Are you sure you want to clear the table?')) {
            orders[currentTable] = [];
            updateOrderSummary();
            updateTableButtonColor(currentTable);
            saveOrdersToLocalStorage();
            document.getElementById('clearTableBtn').style.display = 'none'; // Hide clear table button after clearing
            showTables(); // Navigate back to table selection screen
        }
    }
}

function updateTableButtonColor(tableNumber) {
    const tableButton = document.getElementById(`table${tableNumber}`);
    if (orders[tableNumber] && orders[tableNumber].some(order => order.submitted)) {
        tableButton.classList.add('submitted');
    } else {
        tableButton.classList.remove('submitted');
    }
}

// Show tables by default
showTables();
