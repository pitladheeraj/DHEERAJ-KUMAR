transition: border 0.3s;
}
input:focus {
border-color: #007BFF;
}
.error {
color: red;
font-size: 0.9em;
margin-top: 4px;
}
.success {
color: green;
font-weight: bold;
margin-top: 15px;
text-align: center;
}
.valid {
border-color: green !important;
}
.invalid {
border-color: red !important;
}
button {
width: 100%;
padding: 10px;
background: #007BFF;
border: none;
color: white;
border-radius: 6px;
font-size: 1em;
cursor: pointer;
}
button:hover {
background: #0056b3;
}
function validatePassword() {
if (!passwordRegex.test(password.value)) {
passwordError.textContent = "Password must be 6+ chars, include number & special char";
password.classList.add("invalid");
password.classList.remove("valid");
return false;
}
passwordError.textContent = "";
password.classList.add("valid");
password.classList.remove("invalid");
return true;
}
function validatePhone() {
if (!phoneRegex.test(phone.value)) {
phoneError.textContent = "Phone must be 10 digits";
phone.classList.add("invalid");
phone.classList.remove("valid");
return false;
}
phoneError.textContent = "";
phone.classList.add("valid");
phone.classList.remove("invalid");
return true;
}
// Add event listeners for real-time validation
fullname.addEventListener("input", validateFullname);
email.addEventListener("input", validateEmail);
password.addEventListener("input", validatePassword);
phone.addEventListener("input", validatePhone);
// Handle form submission
form.addEventListener("submit", function (e) {
e.preventDefault();
let isValid = validateFullname() & validateEmail() & validatePassword() & validatePhone();
if (isValid) {
successMessage.textContent = "Form submitted successfully!";
form.reset();
fullname.classList.remove("valid");
email.classList.remove("valid");
password.classList.remove("valid");
phone.classList.remove("valid");
} else {
successMessage.textContent = "";
}
});