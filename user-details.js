document.addEventListener("DOMContentLoaded", () => {
	const params = new URLSearchParams(window.location.search);
	const uuid = params.get("uuid");

	const userDetails = document.getElementById("user-details");
	const backButton = document.getElementById("back-button");

	backButton.addEventListener("click", () => {
		window.history.back();
	});

	function displayUser(user) {
		userDetails.innerHTML = `
            <div class="user-details-card">
                <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}" class="user-details-image">
                <h2>${user.name.first} ${user.name.last}</h2>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Address:</strong> ${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country} ${user.location.postcode}</p>
            </div>
        `;
	}

	// Retrieve users from localStorage
	const users = JSON.parse(localStorage.getItem("users"));

	if (users) {
		const user = users.find((user) => user.login.uuid === uuid);

		if (user) {
			displayUser(user);
		} else {
			userDetails.innerHTML = "<p>User not found.</p>";
		}
	} else {
		// If users not in localStorage, fetch new users and try to find the user
		fetch(`https://randomuser.me/api/?results=10`)
			.then((response) => response.json())
			.then((data) => {
				const user = data.results.find((user) => user.login.uuid === uuid);
				if (user) {
					displayUser(user);
				} else {
					userDetails.innerHTML = "<p>User not found.</p>";
				}
			});
	}
});
