// Finance Tracker Application

// Data storage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgets = JSON.parse(localStorage.getItem('budgets')) || [];

// Default categories
const DEFAULT_INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'];
const DEFAULT_EXPENSE_CATEGORIES = ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Education', 'Personal Care', 'Debt', 'Savings', 'Other'];

// DOM Elements
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.section');
const transactionForm = document.getElementById('transactionForm');
const transactionTypeSelect = document.getElementById('transactionType');
const categorySelect = document.getElementById('category');
const budgetForm = document.getElementById('budgetForm');
const budgetCategorySelect = document.getElementById('budgetCategory');
const filterTypeSelect = document.getElementById('filterType');
const filterCategorySelect = document.getElementById('filterCategory');
const filterDateSelect = document.getElementById('filterDate');
const reportTypeSelect = document.getElementById('reportType');
const reportPeriodSelect = document.getElementById('reportPeriod');
const generateReportBtn = document.getElementById('generateReport');

// Animation helper function
function animateElement(element, animationClass) {
    element.classList.add(animationClass);
    element.addEventListener('animationend', () => {
        element.classList.remove(animationClass);
    }, { once: true });
}

// Initialize the application
function initApp() {
    setupEventListeners();
    populateCategories();
    animateDashboard();
    updateDashboard();
    displayTransactions();
    displayBudgets();
}

// Animate dashboard elements sequentially
function animateDashboard() {
    const dashboardCards = document.querySelectorAll('.dashboard-cards .card');
    const chartCards = document.querySelectorAll('.chart-card');
    
    // Animate cards with delay
    dashboardCards.forEach((card, index) => {
        setTimeout(() => {
            animateElement(card, 'slide-in-up');
        }, index * 150);
    });
    
    // Animate charts with delay
    setTimeout(() => {
        chartCards.forEach((chart, index) => {
            setTimeout(() => {
                animateElement(chart, 'fade-in');
            }, index * 200);
        });
    }, dashboardCards.length * 150);
}

// Set up event listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section with animation
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    
                    // Animate different sections in different ways
                    if (targetId === 'dashboard') {
                        animateDashboard();
                    } else if (targetId === 'transactions') {
                        animateElement(section, 'slide-in-right');
                    } else if (targetId === 'budgets') {
                        animateElement(section, 'slide-in-left');
                    } else if (targetId === 'reports') {
                        animateElement(section, 'scale-in');
                    }
                }
            });
        });
    });
    
    // Transaction type change
    transactionTypeSelect.addEventListener('change', populateCategories);
    
    // Transaction form submission
    transactionForm.addEventListener('submit', addTransaction);
    
    // Budget form submission
    budgetForm.addEventListener('submit', addBudget);
    
    // Filter changes
    filterTypeSelect.addEventListener('change', displayTransactions);
    filterCategorySelect.addEventListener('change', displayTransactions);
    filterDateSelect.addEventListener('change', displayTransactions);
    
    // Generate report
    generateReportBtn.addEventListener('click', function() {
        animateElement(this, 'scale-in');
        generateReport();
    });
    
    // Add hover effects for better interaction feedback
    const buttons = document.querySelectorAll('button:not(.delete-btn)');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-3px)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = '';
        });
    });
}

// Populate category dropdowns
function populateCategories() {
    // Clear current options
    categorySelect.innerHTML = '';
    budgetCategorySelect.innerHTML = '';
    filterCategorySelect.innerHTML = '<option value="all">All</option>';
    
    // Get categories based on transaction type
    const categories = transactionTypeSelect.value === 'income' 
        ? DEFAULT_INCOME_CATEGORIES 
        : DEFAULT_EXPENSE_CATEGORIES;
    
    // Add categories to transaction form
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categorySelect.appendChild(option);
        
        // Also add to filter dropdown
        const filterOption = option.cloneNode(true);
        filterCategorySelect.appendChild(filterOption);
    });
    
    // Add expense categories to budget form
    DEFAULT_EXPENSE_CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        budgetCategorySelect.appendChild(option);
    });
}

// Add new transaction
function addTransaction(e) {
    e.preventDefault();
    
    const type = transactionTypeSelect.value;
    const category = categorySelect.value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    
    const transaction = {
        id: Date.now(),
        type,
        category,
        amount,
        description,
        date
    };
    
    transactions.push(transaction);
    saveTransactions();
    
    // Reset form
    transactionForm.reset();
    
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    // Update UI with animations
    animateElement(document.querySelector('.dashboard-cards'), 'scale-in');
    updateDashboard();
    displayTransactions();
    
    // Show success notification
    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`, 'success');
}

// Function to show notification with particle effects
function showNotification(message, type = 'success') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification';
        notificationContainer.className = 'notification';
        document.body.appendChild(notificationContainer);
    }

    // Clear previous notification content
    notificationContainer.innerHTML = '';
    notificationContainer.className = 'notification ' + type;

    // Create inner container
    const inner = document.createElement('div');
    inner.className = 'notification-inner';
    
    // Create icon
    const icon = document.createElement('div');
    icon.className = 'notification-icon';
    
    // Create content
    const content = document.createElement('div');
    content.className = 'notification-content';
    content.textContent = message;
    
    // Create progress bar
    const progress = document.createElement('div');
    progress.className = 'notification-progress';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'notification-progress-bar';
    progress.appendChild(progressBar);
    
    // Create particles container
    const particles = document.createElement('div');
    particles.className = 'notification-particles';
    
    // Add particles
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'notification-particle';
        
        // Random size between 5-15px
        const size = 5 + Math.random() * 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        const x = 25 + Math.random() * 50; // Stay within middle area
        const y = 25 + Math.random() * 50;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        // Random animation
        const animIndex = Math.floor(Math.random() * 4) + 1;
        const animDuration = 2 + Math.random() * 3;
        const animDelay = Math.random() * 2;
        
        particle.style.animation = `particle-animation-${animIndex} ${animDuration}s ease-out ${animDelay}s infinite`;
        particles.appendChild(particle);
    }
    
    // Assemble notification
    inner.appendChild(icon);
    inner.appendChild(content);
    notificationContainer.appendChild(inner);
    notificationContainer.appendChild(progress);
    notificationContainer.appendChild(particles);
    
    // Show notification
    setTimeout(() => {
        notificationContainer.classList.add('show');
    }, 10);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notificationContainer.classList.add('hide');
        setTimeout(() => {
            notificationContainer.classList.remove('show', 'hide');
        }, 500);
    }, 5000);
}

// Use this function to show notifications instead of the previous one
function showAddedMessage(type) {
    if (type === 'transaction') {
        showNotification('Transaction added successfully!', 'success');
    } else if (type === 'budget') {
        showNotification('Budget added successfully!', 'success');
    }
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showWarningMessage(message) {
    showNotification(message, 'warning');
}

// Add new budget
function addBudget(e) {
    e.preventDefault();
    
    const category = budgetCategorySelect.value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);
    const period = document.getElementById('budgetPeriod').value;
    
    // Check if budget for this category already exists
    const existingBudgetIndex = budgets.findIndex(b => b.category === category && b.period === period);
    
    if (existingBudgetIndex !== -1) {
        // Update existing budget
        budgets[existingBudgetIndex].amount = amount;
        showNotification(`Budget for ${category} updated!`, 'info');
    } else {
        // Create new budget
        const budget = {
            id: Date.now(),
            category,
            amount,
            period
        };
        budgets.push(budget);
        showNotification(`New budget for ${category} created!`, 'success');
    }
    
    saveBudgets();
    
    // Reset form
    budgetForm.reset();
    
    // Update UI
    displayBudgets();
}

// Save transactions to local storage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Save budgets to local storage
function saveBudgets() {
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

// Update dashboard with summary data
function updateDashboard() {
    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    // Update summary cards with animation
    animateNumber('totalBalance', balance, 1000);
    animateNumber('totalIncome', totalIncome, 1000);
    animateNumber('totalExpense', totalExpense, 1000);
    
    // Display recent transactions
    displayRecentTransactions();
    
    // Generate charts
    generateExpenseChart();
    generateOverviewChart();
}

// Animate number counting up
function animateNumber(elementId, targetValue, duration = 1000) {
    const element = document.getElementById(elementId);
    const startValue = parseFloat(element.textContent) || 0;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = startValue + (targetValue - startValue) * easedProgress;
        
        element.textContent = currentValue.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Easing function for smoother animation
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

// Display recent transactions
function displayRecentTransactions() {
    const recentTransactionsList = document.getElementById('recentTransactionsList');
    recentTransactionsList.innerHTML = '';
    
    // Get 5 most recent transactions
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recentTransactions.length === 0) {
        recentTransactionsList.innerHTML = '<p>No transactions yet.</p>';
        return;
    }
    
    recentTransactions.forEach((transaction, index) => {
        const item = createTransactionElement(transaction);
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        recentTransactionsList.appendChild(item);
        
        // Staggered animation
        setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Display all transactions with filtering
function displayTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    // Get filter values
    const typeFilter = filterTypeSelect.value;
    const categoryFilter = filterCategorySelect.value;
    const dateFilter = filterDateSelect.value;
    
    // Apply filters
    let filteredTransactions = transactions;
    
    if (typeFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
    }
    
    if (categoryFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
    }
    
    if (dateFilter !== 'all') {
        const today = new Date();
        let startDate;
        
        switch (dateFilter) {
            case 'thisMonth':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'lastMonth':
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
                filteredTransactions = filteredTransactions.filter(t => {
                    const transactionDate = new Date(t.date);
                    return transactionDate >= startDate && transactionDate <= endDate;
                });
                break;
            case 'thisYear':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
            default:
                startDate = null;
        }
        
        if (startDate && dateFilter !== 'lastMonth') {
            filteredTransactions = filteredTransactions.filter(t => {
                return new Date(t.date) >= startDate;
            });
        }
    }
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = '<p>No transactions found with the selected filters.</p>';
        return;
    }
    
    filteredTransactions.forEach((transaction, index) => {
        const item = createTransactionElement(transaction);
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        transactionsList.appendChild(item);
        
        // Staggered animation
        setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

// Create transaction element
function createTransactionElement(transaction) {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    
    const details = document.createElement('div');
    details.className = 'transaction-details';
    
    const description = document.createElement('div');
    description.className = 'transaction-description';
    description.textContent = transaction.description;
    
    const category = document.createElement('div');
    category.className = 'transaction-category';
    category.textContent = transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1);
    
    const date = document.createElement('div');
    date.className = 'transaction-date';
    date.textContent = new Date(transaction.date).toLocaleDateString();
    
    const amount = document.createElement('div');
    amount.className = `transaction-amount ${transaction.type}`;
    amount.textContent = `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}`;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => {
        deleteTransaction(transaction.id);
    });
    
    details.appendChild(description);
    details.appendChild(category);
    details.appendChild(date);
    
    item.appendChild(details);
    item.appendChild(amount);
    item.appendChild(deleteBtn);
    
    return item;
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        updateDashboard();
        displayTransactions();
        showNotification('Transaction deleted', 'warning');
    }
}

// Display budgets
function displayBudgets() {
    const budgetsList = document.getElementById('budgetsList');
    budgetsList.innerHTML = '';
    
    if (budgets.length === 0) {
        budgetsList.innerHTML = '<p>No budgets set. Create a budget to start tracking your spending.</p>';
        return;
    }
    
    // For each budget, calculate current spending
    budgets.forEach((budget, index) => {
        // Get relevant transactions
        const today = new Date();
        let startDate;
        
        if (budget.period === 'monthly') {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        } else { // yearly
            startDate = new Date(today.getFullYear(), 0, 1);
        }
        
        const totalSpent = transactions
            .filter(t => t.type === 'expense' && 
                    t.category === budget.category && 
                    new Date(t.date) >= startDate)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const percentSpent = (totalSpent / budget.amount) * 100;
        let statusClass = 'success';
        
        if (percentSpent >= 90) {
            statusClass = 'danger';
        } else if (percentSpent >= 75) {
            statusClass = 'warning';
        }
        
        const item = document.createElement('div');
        item.className = 'budget-item';
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        const category = document.createElement('div');
        category.className = 'budget-category';
        category.textContent = budget.category.charAt(0).toUpperCase() + budget.category.slice(1);
        
        const progress = document.createElement('div');
        progress.className = 'budget-progress';
        
        const bar = document.createElement('div');
        bar.className = `budget-bar ${statusClass}`;
        // Start at 0 width for animation
        bar.style.width = '0%';
        
        const amount = document.createElement('div');
        amount.className = 'budget-amount';
        amount.textContent = `$${totalSpent.toFixed(2)} / $${budget.amount.toFixed(2)}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            deleteBudget(budget.id);
        });
        
        progress.appendChild(bar);
        
        item.appendChild(category);
        item.appendChild(progress);
        item.appendChild(amount);
        item.appendChild(deleteBtn);
        
        budgetsList.appendChild(item);
        
        // Staggered animation for list items
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            
            // Animate progress bar after item appears
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-out';
                bar.style.width = `${Math.min(percentSpent, 100)}%`;
            }, 300);
        }, index * 150);
    });
}

// Delete budget
function deleteBudget(id) {
    if (confirm('Are you sure you want to delete this budget?')) {
        budgets = budgets.filter(b => b.id !== id);
        saveBudgets();
        displayBudgets();
        showNotification('Budget deleted', 'warning');
    }
}

// Generate expense chart
function generateExpenseChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    // Get expense data
    const categoryData = {};
    
    transactions
        .filter(t => t.type === 'expense')
        .forEach(transaction => {
            if (!categoryData[transaction.category]) {
                categoryData[transaction.category] = 0;
            }
            categoryData[transaction.category] += transaction.amount;
        });
    
    const categories = Object.keys(categoryData);
    const amounts = Object.values(categoryData);
    
    // Generate random colors
    const backgroundColors = categories.map(() => 
        `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );
    
    // Destroy existing chart if exists
    if (window.expenseChart instanceof Chart) {
        window.expenseChart.destroy();
    }
    
    // Create new chart with animation
    window.expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

// Generate monthly overview chart
function generateOverviewChart() {
    const ctx = document.getElementById('overviewChart').getContext('2d');
    
    // Get monthly data for the past 6 months
    const months = [];
    const incomeData = [];
    const expenseData = [];
    
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = monthDate.toLocaleString('default', { month: 'short' });
        const monthYear = monthDate.getFullYear();
        
        const monthLabel = `${monthName} ${monthYear}`;
        months.push(monthLabel);
        
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthIncome = transactions
            .filter(t => t.type === 'income' &&
                    new Date(t.date) >= monthStart &&
                    new Date(t.date) <= monthEnd)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthExpense = transactions
            .filter(t => t.type === 'expense' &&
                    new Date(t.date) >= monthStart &&
                    new Date(t.date) <= monthEnd)
            .reduce((sum, t) => sum + t.amount, 0);
        
        incomeData.push(monthIncome);
        expenseData.push(monthExpense);
    }
    
    // Destroy existing chart if exists
    if (window.overviewChart instanceof Chart) {
        window.overviewChart.destroy();
    }
    
    // Create new chart with animations
    window.overviewChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'rgba(231, 76, 60, 0.7)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Set today's date as default in the date field
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 50px;
            background: white;
            color: var(--dark-color);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transform: translateY(-100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification.success {
            background: var(--gradient-secondary);
            color: white;
        }
        
        .notification.warning {
            background: linear-gradient(135deg, var(--warning-color), #ffeaa7);
            color: #333;
        }
        
        .notification.error {
            background: linear-gradient(135deg, var(--danger-color), #fab1a0);
            color: white;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize app with intro animation
    setTimeout(() => {
        initApp();
    }, 300);
});

// Generate financial reports
function generateReport() {
    const reportType = reportTypeSelect.value;
    const reportPeriod = reportPeriodSelect.value;
    
    // Get date range based on selected period
    const today = new Date();
    let startDate, endDate;
    
    switch (reportPeriod) {
        case 'thisMonth':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'lastMonth':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'thisQuarter':
            const quarterMonth = Math.floor(today.getMonth() / 3) * 3;
            startDate = new Date(today.getFullYear(), quarterMonth, 1);
            endDate = new Date(today.getFullYear(), quarterMonth + 3, 0);
            break;
        case 'thisYear':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31);
            break;
        default:
            startDate = new Date(2000, 0, 1);
            endDate = new Date(2100, 11, 31);
    }
    
    // Filter transactions by date range
    const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    // Generate report based on type
    const reportChart = document.getElementById('reportChart').getContext('2d');
    const reportSummary = document.getElementById('reportSummary');
    
    // Destroy existing chart if exists
    if (window.reportChart instanceof Chart) {
        window.reportChart.destroy();
    }
    
    switch (reportType) {
        case 'expense':
            generateExpenseAnalysisReport(filteredTransactions, reportChart, reportSummary);
            break;
        case 'income':
            generateIncomeAnalysisReport(filteredTransactions, reportChart, reportSummary);
            break;
        case 'savings':
            generateSavingsRateReport(filteredTransactions, reportChart, reportSummary);
            break;
        case 'category':
            generateCategoryBreakdownReport(filteredTransactions, reportChart, reportSummary);
            break;
    }
}

// Generate expense analysis report
function generateExpenseAnalysisReport(transactions, chartCtx, summaryElement) {
    // Filter expenses
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const categoryData = {};
    expenses.forEach(transaction => {
        if (!categoryData[transaction.category]) {
            categoryData[transaction.category] = 0;
        }
        categoryData[transaction.category] += transaction.amount;
    });
    
    const categories = Object.keys(categoryData);
    const amounts = Object.values(categoryData);
    
    // Calculate total
    const totalExpense = amounts.reduce((sum, amount) => sum + amount, 0);
    
    // Generate random colors
    const backgroundColors = categories.map(() => 
        `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );
    
    // Create chart
    window.reportChart = new Chart(chartCtx, {
        type: 'pie',
        data: {
            labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12
                    }
                }
            }
        }
    });
    
    // Generate summary
    let summaryHTML = `
        <h3>Expense Analysis</h3>
        <p>Total Expenses: $${totalExpense.toFixed(2)}</p>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    categories.forEach((category, index) => {
        const amount = amounts[index];
        const percentage = ((amount / totalExpense) * 100).toFixed(1);
        
        summaryHTML += `
            <tr>
                <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                <td>$${amount.toFixed(2)}</td>
                <td>${percentage}%</td>
            </tr>
        `;
    });
    
    summaryHTML += `
            </tbody>
        </table>
    `;
    
    summaryElement.innerHTML = summaryHTML;
}

// Generate income analysis report
function generateIncomeAnalysisReport(transactions, chartCtx, summaryElement) {
    // Filter income
    const incomes = transactions.filter(t => t.type === 'income');
    
    // Group by category
    const categoryData = {};
    incomes.forEach(transaction => {
        if (!categoryData[transaction.category]) {
            categoryData[transaction.category] = 0;
        }
        categoryData[transaction.category] += transaction.amount;
    });
    
    const categories = Object.keys(categoryData);
    const amounts = Object.values(categoryData);
    
    // Calculate total
    const totalIncome = amounts.reduce((sum, amount) => sum + amount, 0);
    
    // Generate random colors
    const backgroundColors = categories.map(() => 
        `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );
    
    // Create chart
    window.reportChart = new Chart(chartCtx, {
        type: 'pie',
        data: {
            labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12
                    }
                }
            }
        }
    });
    
    // Generate summary
    let summaryHTML = `
        <h3>Income Analysis</h3>
        <p>Total Income: $${totalIncome.toFixed(2)}</p>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    categories.forEach((category, index) => {
        const amount = amounts[index];
        const percentage = ((amount / totalIncome) * 100).toFixed(1);
        
        summaryHTML += `
            <tr>
                <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                <td>$${amount.toFixed(2)}</td>
                <td>${percentage}%</td>
            </tr>
        `;
    });
    
    summaryHTML += `
            </tbody>
        </table>
    `;
    
    summaryElement.innerHTML = summaryHTML;
}

// Generate savings rate report
function generateSavingsRateReport(transactions, chartCtx, summaryElement) {
    // Calculate income and expenses
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
    
    // Create chart
    window.reportChart = new Chart(chartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Expenses', 'Savings'],
            datasets: [{
                data: [totalExpense, savings > 0 ? savings : 0],
                backgroundColor: [
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(46, 204, 113, 0.7)'
                ],
                borderColor: [
                    'rgba(231, 76, 60, 1)',
                    'rgba(46, 204, 113, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12
                    }
                }
            }
        }
    });
    
    // Generate summary
    let savingsStatus = '';
    if (savingsRate >= 20) {
        savingsStatus = 'Excellent';
    } else if (savingsRate >= 10) {
        savingsStatus = 'Good';
    } else if (savingsRate > 0) {
        savingsStatus = 'Fair';
    } else {
        savingsStatus = 'Poor';
    }
    
    const summaryHTML = `
        <h3>Savings Analysis</h3>
        <table class="report-table">
            <tbody>
                <tr>
                    <th>Total Income:</th>
                    <td>$${totalIncome.toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Total Expenses:</th>
                    <td>$${totalExpense.toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Savings:</th>
                    <td>$${savings.toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Savings Rate:</th>
                    <td>${savingsRate.toFixed(1)}%</td>
                </tr>
                <tr>
                    <th>Status:</th>
                    <td>${savingsStatus}</td>
                </tr>
            </tbody>
        </table>
        <div class="savings-tips">
            <h4>Savings Tips</h4>
            <ul>
                <li>Aim for a savings rate of at least 20% of your income.</li>
                <li>Create an emergency fund with 3-6 months of expenses.</li>
                <li>Review your expenses regularly to identify areas to cut back.</li>
                <li>Set specific savings goals to stay motivated.</li>
            </ul>
        </div>
    `;
    
    summaryElement.innerHTML = summaryHTML;
}

// Generate category breakdown report
function generateCategoryBreakdownReport(transactions, chartCtx, summaryElement) {
    // Group transactions by date (month) and category
    const monthlyData = {};
    
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const label = new Date(date.getFullYear(), date.getMonth(), 1)
            .toLocaleString('default', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
                label,
                categories: {}
            };
        }
        
        if (transaction.type === 'expense') {
            if (!monthlyData[monthYear].categories[transaction.category]) {
                monthlyData[monthYear].categories[transaction.category] = 0;
            }
            monthlyData[monthYear].categories[transaction.category] += transaction.amount;
        }
    });
    
    // Sort months
    const sortedMonths = Object.keys(monthlyData)
        .sort()
        .map(key => ({
            key,
            ...monthlyData[key]
        }));
    
    // Get unique categories across all months
    const uniqueCategories = new Set();
    sortedMonths.forEach(month => {
        Object.keys(month.categories).forEach(category => {
            uniqueCategories.add(category);
        });
    });
    
    const categories = Array.from(uniqueCategories);
    
    // Prepare data for stacked bar chart
    const labels = sortedMonths.map(month => month.label);
    const datasets = categories.map(category => {
        const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
        
        return {
            label: category.charAt(0).toUpperCase() + category.slice(1),
            data: sortedMonths.map(month => month.categories[category] || 0),
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1
        };
    });
    
    // Create chart
    window.reportChart = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
    
    // Generate summary
    let summaryHTML = `
        <h3>Category Breakdown by Month</h3>
        <p>This chart shows how your spending in each category has changed over time.</p>
    `;
    
    // Calculate category totals
    const categoryTotals = {};
    categories.forEach(category => {
        categoryTotals[category] = sortedMonths.reduce((sum, month) => {
            return sum + (month.categories[category] || 0);
        }, 0);
    });
    
    // Sort categories by total amount
    const sortedCategories = Object.keys(categoryTotals)
        .sort((a, b) => categoryTotals[b] - categoryTotals[a]);
    
    summaryHTML += `
        <table class="report-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Total Spent</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    sortedCategories.forEach(category => {
        summaryHTML += `
            <tr>
                <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                <td>$${categoryTotals[category].toFixed(2)}</td>
            </tr>
        `;
    });
    
    summaryHTML += `
            </tbody>
        </table>
    `;
    
    summaryElement.innerHTML = summaryHTML;
}