document.addEventListener("DOMContentLoaded", () => {
	let page = 1;

	const userList = document.getElementById("user-list");
	const prevButton = document.getElementById("prev-button");
	const nextButton = document.getElementById("next-button");

	function fetchUsers() {
		fetch(`https://randomuser.me/api/?results=10&page=${page}`)
			.then((response) => response.json())
			.then((data) => {
				localStorage.setItem("users", JSON.stringify(data.results));
				displayUsers(data.results);
			});
	}

	function displayUsers(users) {
		userList.innerHTML = "";

		users.forEach((user) => {
			const card = document.createElement("div");
			card.className = "user-card";

			card.innerHTML = `
                <a href="user-details.html?uuid=${user.login.uuid}" class="user-link">
                    <img src="${user.picture.thumbnail}" alt="${user.name.first} ${user.name.last}" class="user-image">
                    <div class="user-info">
                        <h2>${user.name.first} ${user.name.last}</h2>
                        <p>${user.email}</p>
                        <p>${user.phone}</p>
                    </div>
                </a>
            `;

			userList.appendChild(card);
		});
	}

	prevButton.addEventListener("click", () => {
		if (page > 1) {
			page--;
			fetchUsers();
		}
	});

	nextButton.addEventListener("click", () => {
		page++;
		fetchUsers();
	});

	// Initial fetch
	fetchUsers();
});
