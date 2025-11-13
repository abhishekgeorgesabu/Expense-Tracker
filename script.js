let expenses = localStorage.getItem("expenses")
	? JSON.parse(localStorage.getItem("expenses"))
	: [];
let id = localStorage.getItem("id") ? localStorage.getItem("id") : 0;
let addBtn = document.querySelector(".add-btn");

// modal

let modal = document.querySelector(".modal");
let modalData = Array.from(modal.querySelectorAll("input"));

let modalTotal = modal.querySelector(".modal-total-cost");
let modalSubmit = modal.querySelector(".modal-submit");

// values

let totalExp = 0;
let itemTotal = modal.querySelector(".modal-total-cost");
let itemName = modal.querySelector("#item-name");
let itemCost = modal.querySelector("#item-cost");
let itemCount = modal.querySelector("#item-count");

// items

let itemSection = document.querySelector(".item-section");

// make cards of already existing data in local storage

expenses.forEach((eachExpense) => {
	totalExp += +eachExpense.total;
	updateTotalExp();
	makeCard(eachExpense);
});

// Card

let cardEditBtn = itemSection.querySelectorAll(".card-edit")
	? Array.from(itemSection.querySelectorAll(".card-edit"))
	: [];

let cardDltBtn = itemSection.querySelectorAll(".card-dlt")
	? Array.from(itemSection.querySelectorAll(".card-dlt"))
	: [];

// Close input tab

let closeTab = (x) => {
	if (x.target === modal) {
		modal.style.display = "none";
		modal.removeEventListener("click", closeTab);
	}
};

// append button

addBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	modal.style.display = "flex";
	modal.addEventListener("click", (x) => closeTab(x));
});

// filing process

itemCost.addEventListener("input", () => {
	itemTotal.textContent = `₹${itemCost.value * itemCount.value}`;
});

itemCount.addEventListener("input", () => {
	itemTotal.textContent = `₹${itemCost.value * itemCount.value}`;
});

// submission process

modalSubmit.addEventListener("click", () => {
	// Check if all fields are filled
	if (modalData.some((e) => e.value == "")) {
		alert("Fill all the fields!!!");
	}

	// Taking values and appending to local storage
	else {
		updateTotalExp();
		let eachExpense = {
			item: itemName.value.trim(),
			cost: itemCost.value,
			count: itemCount.value,
			total: itemTotal.textContent.slice(1, itemTotal.textContent.length),
			id: id,
		};
		id++;
		expenses.push(eachExpense);

		// pushing to local storage
		localStorage.setItem("expenses", JSON.stringify(expenses));
		localStorage.setItem("id", id);

		makeCard(eachExpense);

		// Edit button list updation

		cardEditBtn.push(
			itemSection
				.querySelectorAll(".card-edit")
				.item(itemSection.querySelectorAll(".card-edit").length - 1)
		);
		cardEdit(
			itemSection
				.querySelectorAll(".card-edit")
				.item(itemSection.querySelectorAll(".card-edit").length - 1)
		);

		// Delete button list updation
		cardDltBtn.push(
			itemSection
				.querySelectorAll(".card-dlt")
				.item(itemSection.querySelectorAll(".card-dlt").length - 1)
		);
		cardDlt(
			itemSection
				.querySelectorAll(".card-dlt")
				.item(itemSection.querySelectorAll(".card-dlt").length - 1)
		);

		modal.style.display = "none";
		modal.querySelectorAll("input").forEach((inputBox) => {
			inputBox.value = "";
		});
		modalTotal.textContent = "₹0";
	}
});

//Capitalize first letter

function capitalize(item) {
	return item.charAt(0).toUpperCase() + item.slice(1);
}

// update Total expense

function updateTotalExp() {
	totalExp += +itemTotal.textContent.slice(1, itemTotal.textContent.length);
	document.querySelector(".total-expense").textContent = `₹${totalExp}`;
}

// Make item cards

function makeCard(expense) {
	const card = document.createElement("div");
	const cardId = expense.id;
	card.className = `item-card ${cardId}`;
	card.innerHTML = `<div class="card-data">
	<div class="card-item">${expense.item}</div> 
	<div class="card-cost">₹${expense.cost}</div>
	<div class="card-count">x${expense.count}</div>
	</div>
	<div class="card-total">₹${expense.total}</div>
	<div class="card-options">
	<button class="card-edit">Edit</button>
	<button class="card-dlt">Delete</button>
	</div>`;
	itemSection.appendChild(card);
}

//Edit item cards

function cardEdit(btn) {}

cardEditBtn.forEach;

//Delete item cards

function cardDlt(btn) {
	btn.addEventListener("click", () => {
		let box = btn.parentNode.parentNode;
		let cardId = box.classList[1];
		itemSection.removeChild(box);
		totalExp -=
			+box.querySelector(".card-cost").textContent.substring(1) *
			+box.querySelector(".card-count").textContent.substring(1);
		updateTotalExp();
		let bin = expenses.splice(`${cardId}`, 1);
		localStorage.setItem("expenses", JSON.stringify(expenses));
		console.log(bin);
	});
}

cardDltBtn.forEach((btn) => {
	if (btn) {
		cardDlt(btn);
	}
});
