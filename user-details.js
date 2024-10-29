document.addEventListener("DOMContentLoaded", () => {
	const params = new URLSearchParams(window.location.search);
	const uuid = params.get("uuid");

	const userDetails = document.getElementById("user-details");
	const backButton = document.getElementById("back-button");

	if (backButton) {
		backButton.addEventListener("click", () => {
			window.history.back();
		});
	}

	function displayUser(user) {
		userDetails.innerHTML = `
            <div class="user-details-card">
                <img src="${user.largePicture}" alt="${user.firstName} ${user.lastName}" class="user-details-image">
                <h2>${user.firstName} ${user.lastName}</h2>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Address:</strong> ${user.streetNumber} ${user.streetName}, ${user.city}, ${user.state}, ${user.country} ${user.postcode}</p>
            </div>
        `;
	}

	// Fetch the user directly from the backend
	fetch(`http://localhost:5153/api/user/${uuid}`)
		.then((response) => response.json())
		.then((user) => {
			if (user) {
				displayUser(user);
			} else {
				userDetails.innerHTML = "<p>User not found.</p>";
			}
		})
		.catch((error) => {
			userDetails.innerHTML = "<p>Error fetching user details.</p>";
			console.error(error);
		});
});
