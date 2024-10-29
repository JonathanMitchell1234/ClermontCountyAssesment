// TODO: implement login with authentication for admin panel

// Define the page variable
let page = 1;
const usersPerPage = 10;
let allUsers = [];

// Get references to the pagination buttons
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

// Get reference to the user list container
const userList = document.getElementById("user-list");

function fetchUsers() {
	fetch(`http://localhost:5153/api/user`)
		.then((response) => response.json())
		.then((data) => {
			console.log("API Response:", data); // Log the entire response

			if (Array.isArray(data) && data.length > 0) {
				allUsers = data;
				displayUsers();
				updatePaginationButtons();
			} else {
				console.error("No users found in the response.");
			}
		})
		.catch((error) => {
			console.error("Error fetching users:", error);
		});
}

function displayUsers() {
	userList.innerHTML = "";

	const startIndex = (page - 1) * usersPerPage;
	const endIndex = startIndex + usersPerPage;
	const usersToDisplay = allUsers.slice(startIndex, endIndex);

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
            <button class="edit-button" data-uuid="${user.uuid}">Edit</button>
        `;

		userList.appendChild(card);
	});

	// Add event listeners to the edit buttons
	document.querySelectorAll(".edit-button").forEach((button) => {
		button.addEventListener("click", (event) => {
			const uuid = event.target.getAttribute("data-uuid");
			const user = allUsers.find((user) => user.uuid === uuid);
			displayEditForm(user);
		});
	});
}

function displayEditForm(user) {
	const editFormContainer = document.getElementById("edit-form-container");
	editFormContainer.innerHTML = `
        <h2>Edit User</h2>
        <form id="edit-form">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" value="${user.firstName}">
            
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" value="${user.lastName}">
            
            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="${user.email}">
            
            <label for="phone">Phone</label>
            <input type="text" id="phone" name="phone" value="${user.phone}">
            
            <label for="streetNumber">Street Number</label>
            <input type="text" id="streetNumber" name="streetNumber" value="${user.streetNumber}">
            
            <label for="streetName">Street Name</label>
            <input type="text" id="streetName" name="streetName" value="${user.streetName}">
            
            <label for="city">City</label>
            <input type="text" id="city" name="city" value="${user.city}">
            
            <label for="state">State</label>
            <input type="text" id="state" name="state" value="${user.state}">
            
            <label for="country">Country</label>
            <input type="text" id="country" name="country" value="${user.country}">
            
            <label for="postcode">Postcode</label>
            <input type="text" id="postcode" name="postcode" value="${user.postcode}">
            
            <label for="largePicture">Large Picture URL</label>
            <input type="text" id="largePicture" name="largePicture" value="${user.largePicture}">
            
            <label for="thumbnailPicture">Thumbnail Picture URL</label>
            <input type="text" id="thumbnailPicture" name="thumbnailPicture" value="${user.thumbnailPicture}">
            
            <button type="submit">Save</button>
            <button type="button" id="cancel-button">Cancel</button>
        </form>
    `;

	document.getElementById("edit-form").addEventListener("submit", (event) => {
		event.preventDefault();
		saveUser(user.uuid);
	});

	document.getElementById("cancel-button").addEventListener("click", () => {
		editFormContainer.innerHTML = "";
	});
}
function saveUser(uuid) {
	const form = document.getElementById("edit-form");
	const updatedUser = {
		uuid: uuid,
		firstName: form.firstName.value,
		lastName: form.lastName.value,
		email: form.email.value,
		phone: form.phone.value,
		streetNumber: form.streetNumber.value,
		streetName: form.streetName.value,
		city: form.city.value,
		state: form.state.value,
		country: form.country.value,
		postcode: form.postcode.value,
		largePicture: form.largePicture.value,
		thumbnailPicture: form.thumbnailPicture.value,
	};

	console.log("Updated User Payload:", updatedUser); // Log the payload

	fetch(`http://localhost:5153/api/user/${uuid}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updatedUser),
	})
		.then((response) => {
			if (!response.ok) {
				// Handle error responses
				return response.json().then((errorData) => {
					console.error("Error response from server:", errorData);
					if (errorData.errors) {
						console.error("Validation errors:", errorData.errors);
					}
					throw new Error(`Error: ${errorData.title || "Unknown error"}`);
				});
			}
			// If the response status is 204 No Content, return null
			if (response.status === 204) {
				return null;
			}
			// Otherwise, parse the response as JSON
			return response.json();
		})
		.then((data) => {
			if (data) {
				console.log("User updated:", data);
			} else {
				console.log("User updated successfully");
			}
			fetchUsers(); // Refresh the user list
			document.getElementById("edit-form-container").innerHTML = ""; // Clear the form
		})
		.catch((error) => {
			console.error("Error updating user:", error);
		});
}

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

// Initial fetch
fetchUsers();
