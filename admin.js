document.addEventListener("DOMContentLoaded", () => {
	let users = [];

	const userList = document.getElementById("user-list");
	const editFormContainer = document.getElementById("edit-form-container");

	function fetchUsers() {
		const savedUsers = JSON.parse(localStorage.getItem("adminUsers"));
		if (savedUsers && savedUsers.length > 0) {
			users = savedUsers;
			displayUsers(users);
		} else {
			fetch("https://randomuser.me/api/?results=10")
				.then((response) => response.json())
				.then((data) => {
					users = data.results;
					localStorage.setItem("adminUsers", JSON.stringify(users));
					displayUsers(users);
				});
		}
	}

	function displayUsers(users) {
		userList.innerHTML = "";

		users.forEach((user) => {
			const card = document.createElement("div");
			card.className = "user-card";

			card.innerHTML = `
                <div class="user-info">
                    <img src="${user.picture.thumbnail}" alt="${user.name.first} ${user.name.last}" class="user-image">
                    <div>
                        <h2>${user.name.first} ${user.name.last}</h2>
                        <p>${user.email}</p>
                        <p>${user.phone}</p>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="edit-button" data-uuid="${user.login.uuid}">Edit</button>
                    <button class="delete-button" data-uuid="${user.login.uuid}">Delete</button>
                </div>
            `;

			userList.appendChild(card);
		});

		// Add event listeners for Edit and Delete buttons
		const editButtons = document.querySelectorAll(".edit-button");
		editButtons.forEach((button) => {
			button.addEventListener("click", handleEdit);
		});

		const deleteButtons = document.querySelectorAll(".delete-button");
		deleteButtons.forEach((button) => {
			button.addEventListener("click", handleDelete);
		});
	}

	function handleEdit(event) {
		const uuid = event.target.getAttribute("data-uuid");
		const user = users.find((user) => user.login.uuid === uuid);

		if (user) {
			showEditForm(user);
		}
	}

	function handleDelete(event) {
		const uuid = event.target.getAttribute("data-uuid");
		users = users.filter((user) => user.login.uuid !== uuid);
		localStorage.setItem("adminUsers", JSON.stringify(users));
		displayUsers(users);
	}

	function showEditForm(user) {
		editFormContainer.innerHTML = `
            <h2>Edit User</h2>
            <form id="edit-form">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value="${user.name.first}" required>

                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value="${user.name.last}" required>

                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="${user.email}" required>

                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone" value="${user.phone}" required>

                <button type="submit">Save Changes</button>
                <button type="button" id="cancel-button">Cancel</button>
            </form>
        `;

		const editForm = document.getElementById("edit-form");
		const cancelButton = document.getElementById("cancel-button");

		editForm.addEventListener("submit", (e) => {
			e.preventDefault();
			const formData = new FormData(editForm);
			user.name.first = formData.get("firstName");
			user.name.last = formData.get("lastName");
			user.email = formData.get("email");
			user.phone = formData.get("phone");

			localStorage.setItem("adminUsers", JSON.stringify(users));
			displayUsers(users);
			editFormContainer.innerHTML = "";
		});

		cancelButton.addEventListener("click", () => {
			editFormContainer.innerHTML = "";
		});
	}

	// Initial fetch
	fetchUsers();
});
