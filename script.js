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

    // Initialize orders if it doesn't exist for the selected table
    if (!orders[currentTable]) {
        orders[currentTable] = [];
    }

    // Show menu or tables based on whether there are existing orders
    if (orders[currentTable] && orders[currentTable].length > 0) {
        showMenu();
    } else {
        showTables();
    }

    updateOrderSummary();
    updateTableButtonColor(currentTable);
}

function addMenuItem(menuItem) {
    if (currentTable !== null) {
        // Check if the item is already in the order
        let found = false;
        orders[currentTable].forEach(order => {
            if (order.item === menuItem) {
                order.quantity++;
                found = true;
            }
        });

        // If not found, add it as a new item
        if (!found) {
            orders[currentTable].push({ item: menuItem, quantity: 1, submitted: false });
        }

        updateOrderSummary();
        updateTableButtonColor(currentTable);
        updateClearTableButtonVisibility(); // Update clear table button visibility
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
        }
        
        if (orders[currentTable][itemIndex].quantity > 1) {
            orders[currentTable][itemIndex].quantity--;
        } else {
            orders[currentTable].splice(itemIndex, 1);
        }
        
        updateOrderSummary();
        updateTableButtonColor(currentTable);
        updateClearTableButtonVisibility(); // Update clear table button visibility
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

function submitOrder() {
    if (currentTable !== null) {
        // Mark all items as submitted
        orders[currentTable].forEach(order => order.submitted = true);
        updateOrderSummary();
        updateTableButtonColor(currentTable);
        updateClearTableButtonVisibility(); // Update clear table button visibility
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
            updateClearTableButtonVisibility(); // Update clear table button visibility
            saveOrdersToLocalStorage();
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

// Load stored orders on page load
window.onload = function() {
    // Update table button colors based on stored orders
    Object.keys(orders).forEach(tableNumber => {
        updateTableButtonColor(tableNumber);
    });

    updateOrderSummary(); // Update summary based on stored orders
};

// Automatically enter fullscreen on page load if launched from home screen on iPad
function autoEnterFullscreen() {
    // Check if the app is launched from the home screen on iPad
    if (navigator.standalone) {
        enterFullscreen();
    }
}

// Fullscreen function
function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        document.documentElement.msRequestFullscreen();
    }
}

// Call autoEnterFullscreen to check if fullscreen should be entered
autoEnterFullscreen();
