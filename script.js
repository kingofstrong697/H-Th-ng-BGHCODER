document.addEventListener('DOMContentLoaded', () => {
    // Define the correct key for validation
    const CORRECT_KEY = 'GiaHungXBGHCODER'; // This is just for demonstration - in a real app, this would be validated server-side

    // Get DOM elements
    const loginForm = document.getElementById('loginForm');
    const keyInput = document.getElementById('keyInput');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    const loginContainer = document.getElementById('loginContainer');
    const controlPanel = document.getElementById('controlPanel');
    
    // Function to validate the key and show the control panel
    function validateKey(event) {
        event.preventDefault();
        
        const enteredKey = keyInput.value.trim();
        
        if (enteredKey === CORRECT_KEY) {
            // Add a slight delay for better visual effect
            setTimeout(() => {
                // Hide the login container
                loginContainer.classList.add('hidden');
                
                // Show the control panel with animation
                controlPanel.classList.remove('hidden');
                controlPanel.classList.add('fade-in');
                
                // Clear the input field and any error messages
                keyInput.value = '';
                errorMessage.textContent = '';
            }, 300);
        } else {
            // Show error message for incorrect key
            errorMessage.textContent = 'Invalid key. Please try again.';
            keyInput.value = '';
            keyInput.focus();
            
            // Add shake animation to the login form
            loginForm.classList.add('shake');
            setTimeout(() => {
                loginForm.classList.remove('shake');
            }, 500);
        }
    }

    // Add event listener to the login form
    loginForm.addEventListener('submit', validateKey);

    // Add click event listeners to all control buttons (for demonstration purposes)
    const controlButtons = document.querySelectorAll('.btn-control');
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log(`Button clicked: ${this.textContent.trim()}`);
            
            // Add a visual feedback when button is clicked
            this.classList.add('btn-clicked');
            setTimeout(() => {
                this.classList.remove('btn-clicked');
            }, 200);
            
            // In a real application, specific functionality would be implemented for each button
        });
    });

    // Focus on the key input field when the page loads
    keyInput.focus();
});
