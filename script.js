// Variables to track the current and previous input, and the current operation
let currentInput = '';
let previousInput = '';
let currentOperation = '';
let shouldResetInput = false; // ✅ New flag to handle reset after calculation

// Reference to the display input element
const display = document.getElementById('display');

/**
 * Updates the calculator display with the most relevant value
 * Priority:
 * 1. Show current input
 * 2. If empty, show previous input
 * 3. If both empty, show 0
 */
function updateDisplay() {
    display.value = currentInput || previousInput || '0';
}

/**
 * Appends a number or decimal point to the current input
 * Prevents multiple decimals in one number
 */
function appendNumber(num) {
    if (shouldResetInput) {
        currentInput = '';          // ✅ Clear input if result was just shown
        shouldResetInput = false;
    }

    if (num === '.' && currentInput.includes('.')) return; // Avoid multiple decimals
    currentInput += num; 
    updateDisplay();     // Update the display
}

/**
 * Sets the operation (+, -, *, /)
 * If there's already a previous value, performs calculation first
 */
function setOperation(op) {
    if (!currentInput) return;          // If no current input, do nothing
    if (previousInput) calculate();     // If there's a previous input, evaluate it first

    currentOperation = op;              // Set the selected operation
    previousInput = currentInput;       // Move current input to previous
    currentInput = '';                  // Clear current input for new number
}

/**
 * Performs the calculation based on current operation
 * Handles division by zero with error message
 */
function calculate() {
    if (!previousInput || !currentInput) return;  // Require both inputs

    const prev = parseFloat(previousInput);       // Convert strings to numbers
    const curr = parseFloat(currentInput);
    let result;

    switch (currentOperation) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            if (curr === 0) {
                display.value = "Error"; // Show error on divide by zero
                currentInput = '';
                previousInput = '';
                currentOperation = '';
                return;
            }
            result = prev / curr;
            break;
        default:
            return; // Exit if no valid operation
    }

    currentInput = result.toString();  // Set result as new current input
    previousInput = '';
    currentOperation = '';
    shouldResetInput = true; // ✅ Set flag so next number input clears this result
    updateDisplay();
}

/**
 * Clears all inputs and resets the calculator
 */
function clearDisplay() {
    currentInput = '';
    previousInput = '';
    currentOperation = '';
    shouldResetInput = false; // ✅ Reset flag
    updateDisplay();
}

/**
 * Negates the current input (positive to negative or vice versa)
 */
function negateValue() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

/**
 * Converts the current input to a percentage
 */
function percentValue() {
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

/**
 * Adds click event listeners to all buttons
 * Checks for data attributes to determine button type:
 * - data-num: number or decimal
 * - data-op: operation (+, -, *, /)
 * - data-action: special action (clear, equals, negate, percent)
 */
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
        const num = btn.getAttribute('data-num');      // Number/decimal input
        const op = btn.getAttribute('data-op');        // Operator input
        const action = btn.getAttribute('data-action'); // Special actions

        if (num !== null) appendNumber(num);               // Handle number input
        else if (op !== null) setOperation(op);            // Handle operator input
        else if (action === 'clear') clearDisplay();       // Clear all
        else if (action === 'equals') calculate();         // Perform calculation
        else if (action === 'negate') negateValue();       // Negate current number
        else if (action === 'percent') percentValue();     // Convert to percent
    });
});
