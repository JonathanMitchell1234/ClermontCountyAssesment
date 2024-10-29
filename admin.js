// admin.js

document.addEventListener("DOMContentLoaded", () => {
	// Check login state on page load
	let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

	// Get references to DOM elements
	const authButton = document.getElementById("auth-button");
	const loginFormContainer = document.getElementById("login-form-container");
	const userList = document.getElementById("user-list");
	const prevButton = document.getElementById("prev-button");
	const nextButton = document.getElementById("next-button");
	const pagination = document.querySelector(".pagination");
	const editFormContainer = document.getElementById("edit-form-container");

	let page = 1;
	const usersPerPage = 10;
	let allUsers = [];

	// Function to update the UI based on login state
	function updateUI() {
		if (isLoggedIn) {
			authButton.textContent = "Logout";
			// Show admin content
			userList.style.display = "flex";
			pagination.style.display = "block";
			editFormContainer.style.display = "block";
			// Hide login form if visible
			loginFormContainer.style.display = "none";
			// Fetch users
			fetchUsers();
		} else {
			authButton.textContent = "Login";
			// Hide admin content
			userList.style.display = "none";
			pagination.style.display = "none";
			editFormContainer.style.display = "none";
		}
	}

	// Function to display the login form
	function displayLoginForm() {
		loginFormContainer.style.display = "block";

		loginFormContainer.innerHTML = `
            <h2>Login</h2>
            <form id="login-form">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
        
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
        
                <button type="submit">Login</button>
                <button type="button" id="cancel-login-button">Cancel</button>
            </form>
            <div id="login-error" style="color: red; display: none;"></div>
        `;

		// Add event listeners for the form
		const loginForm = document.getElementById("login-form");
		const cancelLoginButton = document.getElementById("cancel-login-button");
		const loginError = document.getElementById("login-error");

		loginForm.addEventListener("submit", async (event) => {
			event.preventDefault();
			const username = event.target.username.value.trim();
			const password = event.target.password.value.trim();

			// Basic frontend validation
			if (!username || !password) {
				displayLoginError("Please enter both username and password.");
				return;
			}

			try {
				await login(username, password);
			} catch (error) {
				displayLoginError(error.message);
			}
		});

		cancelLoginButton.addEventListener("click", () => {
			loginFormContainer.style.display = "none";
		});
	}

	// Function to display login errors
	function displayLoginError(message) {
		const loginError = document.getElementById("login-error");
		loginError.textContent = message;
		loginError.style.display = "block";
	}

	// Function to handle the login process
	async function login(username, password) {
		const loginData = {
			username: username,
			password: password,
		};

		try {
			const response = await fetch("http://localhost:5153/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(loginData),
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Login successful:", data);
				localStorage.setItem("isLoggedIn", "true");
				isLoggedIn = true;
				updateUI();
			} else if (response.status === 401) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Invalid credentials.");
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || "An unexpected error occurred.");
			}
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	}

	// Function to handle logout
	function logout() {
		localStorage.setItem("isLoggedIn", "false");
		isLoggedIn = false;
		updateUI();
	}

	// Event listener for the auth button
	authButton.addEventListener("click", () => {
		if (isLoggedIn) {
			// Logout functionality
			logout();
		} else {
			// Show login form
			displayLoginForm();
		}
	});

	// Fetch users from the API
	async function fetchUsers() {
		if (!isLoggedIn) return; // Prevent fetching if not logged in

		try {
			const response = await fetch("http://localhost:5153/api/user", {
				headers: {
					Authorization: "Bearer dummy-token", // Placeholder for future auth
				},
			});
			if (!response.ok) {
				throw new Error("Failed to fetch users.");
			}
			const data = await response.json();
			console.log("API Response:", data); // Log the entire response

			if (Array.isArray(data) && data.length > 0) {
				allUsers = data;
				displayUsers();
				updatePaginationButtons();
			} else {
				console.error("No users found in the response.");
				userList.innerHTML = "<p>No users found.</p>";
			}
		} catch (error) {
			console.error("Error fetching users:", error);
			userList.innerHTML = `<p style="color: red;">Error fetching users: ${error.message}</p>`;
		}
	}

	// Display users on the page
function displayUsers() {
	userList.innerHTML = "";

	const startIndex = (page - 1) * usersPerPage;
	const endIndex = startIndex + usersPerPage;
	const usersToDisplay = allUsers.slice(startIndex, endIndex);

	if (usersToDisplay.length === 0) {
		userList.innerHTML = "<p>No users to display.</p>";
		return;
	}

	usersToDisplay.forEach((user) => {
		const card = document.createElement("div");
		card.className = "user-card";

		card.innerHTML = `
            <a href="user-details.html?uuid=${user.uuid}" class="user-link">
                <img src="${user.thumbnailPicture}" alt="${user.firstName} ${user.lastName}" class="user-image">
                <div class="user-info">
                    <h2>${user.firstName} ${user.lastName}</h2>
                    <p>${user.email}</p>
                    <p>${user.phone}</p>
                </div>
            </a>
            <div class="user-actions">
                <button class="edit-button" data-uuid="${user.uuid}">Edit</button>
            </div>
        `;

		userList.appendChild(card);
	});

	// Add event listeners to the edit buttons
	document.querySelectorAll(".edit-button").forEach((button) => {
		button.addEventListener("click", (event) => {
			const uuid = event.target.getAttribute("data-uuid");
			const user = allUsers.find((user) => user.uuid === uuid);
			if (user) {
				displayEditForm(user);
			} else {
				alert("User not found.");
			}
		});
	});
}


	// Display the edit form
	function displayEditForm(user) {
		editFormContainer.innerHTML = `
            <h2>Edit User</h2>
            <form id="edit-form">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value="${user.firstName}" required>
                
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value="${user.lastName}" required>
                
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="${user.email}" required>
                
                <label for="phone">Phone</label>
                <input type="text" id="phone" name="phone" value="${user.phone}" required>
                
                <label for="streetNumber">Street Number</label>
                <input type="text" id="streetNumber" name="streetNumber" value="${user.streetNumber}" required>
                
                <label for="streetName">Street Name</label>
                <input type="text" id="streetName" name="streetName" value="${user.streetName}" required>
                
                <label for="city">City</label>
                <input type="text" id="city" name="city" value="${user.city}" required>
                
                <label for="state">State</label>
                <input type="text" id="state" name="state" value="${user.state}" required>
                
                <label for="country">Country</label>
                <input type="text" id="country" name="country" value="${user.country}" required>
                
                <label for="postcode">Postcode</label>
                <input type="text" id="postcode" name="postcode" value="${user.postcode}" required>
                
                <label for="largePicture">Large Picture URL</label>
                <input type="url" id="largePicture" name="largePicture" value="${user.largePicture}" required>
                
                <label for="thumbnailPicture">Thumbnail Picture URL</label>
                <input type="url" id="thumbnailPicture" name="thumbnailPicture" value="${user.thumbnailPicture}" required>
                
                <button type="submit">Save</button>
                <button type="button" id="cancel-button">Cancel</button>
            </form>
            <div id="edit-error" style="color: red; display: none;"></div>
        `;

		const editForm = document.getElementById("edit-form");
		const cancelButton = document.getElementById("cancel-button");
		const editError = document.getElementById("edit-error");

		editForm.addEventListener("submit", async (event) => {
			event.preventDefault();
			try {
				await saveUser(user.uuid);
			} catch (error) {
				displayEditError(error.message);
			}
		});

		cancelButton.addEventListener("click", () => {
			editFormContainer.innerHTML = "";
		});
	}

	// Function to display edit errors
	function displayEditError(message) {
		const editError = document.getElementById("edit-error");
		editError.textContent = message;
		editError.style.display = "block";
	}

	// Function to save updated user data
	async function saveUser(uuid) {
		const form = document.getElementById("edit-form");
		const updatedUser = {
			uuid: uuid,
			firstName: form.firstName.value.trim(),
			lastName: form.lastName.value.trim(),
			email: form.email.value.trim(),
			phone: form.phone.value.trim(),
			streetNumber: form.streetNumber.value.trim(),
			streetName: form.streetName.value.trim(),
			city: form.city.value.trim(),
			state: form.state.value.trim(),
			country: form.country.value.trim(),
			postcode: form.postcode.value.trim(),
			largePicture: form.largePicture.value.trim(),
			thumbnailPicture: form.thumbnailPicture.value.trim(),
		};

		try {
			const response = await fetch(`http://localhost:5153/api/user/${uuid}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					// "Authorization": "Bearer dummy-token" // Placeholder for future auth
				},
				body: JSON.stringify(updatedUser),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to update user.");
			}

			if (response.status === 204) {
				console.log("User updated successfully.");
			} else {
				const data = await response.json();
				console.log("User updated:", data);
			}

			fetchUsers(); // Refresh the user list
			editFormContainer.innerHTML = ""; // Clear the form
		} catch (error) {
			console.error("Error updating user:", error);
			throw error;
		}
	}

	// Pagination Functions
	function updatePaginationButtons() {
		if (page <= 1) {
			prevButton.disabled = true;
		} else {
			prevButton.disabled = false;
		}

		const totalPages = Math.ceil(allUsers.length / usersPerPage);
		if (page >= totalPages) {
			nextButton.disabled = true;
		} else {
			nextButton.disabled = false;
		}
	}

	if (prevButton) {
		prevButton.addEventListener("click", () => {
			if (page > 1) {
				page--;
				displayUsers();
				updatePaginationButtons();
			}
		});
	}

	if (nextButton) {
		nextButton.addEventListener("click", () => {
			const totalPages = Math.ceil(allUsers.length / usersPerPage);
			if (page < totalPages) {
				page++;
				displayUsers();
				updatePaginationButtons();
			}
		});
	}

	// Call updateUI initially to set the correct state
	updateUI();
});
