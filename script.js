let expenses = localStorage.getItem("expenses")
	? JSON.parse(localStorage.getItem("expenses"))
	: [];
let id = localStorage.getItem("id") ? Number(localStorage.getItem("id")) : 0;
let addBtn = document.querySelector(".add-btn");

// modal

let modal = document.querySelector(".modal");
let modalData = Array.from(modal.querySelectorAll("input"));

let modalTotal = modal.querySelector(".modal-total-cost");
let modalSubmit = modal.querySelector(".modal-submit");
let modalDiscard = modal.querySelector(".modal-discard");

// values

let totalExp = 0;
let itemTotal = modal.querySelector(".modal-total-cost");
let itemName = modal.querySelector("#item-name");
let itemCost = modal.querySelector("#item-cost");
let itemCount = modal.querySelector("#item-count");

// items

let itemSection = document.querySelector(".item-section");

// make cards of already existing data in local storage

expenses.forEach(makeCard);

updateTotalExp();

// Card

let cardEditBtn = itemSection.querySelectorAll(".card-edit")
	? Array.from(itemSection.querySelectorAll(".card-edit"))
	: [];

let cardDltBtn = itemSection.querySelectorAll(".card-dlt")
	? Array.from(itemSection.querySelectorAll(".card-dlt"))
	: [];

// edit

let editingId = null;

// Close input tab

let closeTab = () => {
	modal.style.display = "none";
	modalData.forEach((e) => (e.value = ""));
	itemCount.value = 1;
	modalTotal.textContent = "₹0";
};

// append button

modal.addEventListener("click", (click) => {
	if (click.target === modal) {
		closeTab(click);
	}
});

addBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	modalSubmit.textContent = editingId !== null ? "Save" : "Add";
	modal.style.display = "flex";
});

// filing process

itemCost.addEventListener("input", () => {
	itemTotal.textContent = `₹${itemCost.value * itemCount.value}`;
});

itemCount.addEventListener("input", () => {
	itemTotal.textContent = `₹${itemCost.value * itemCount.value}`;
});

// submission process

function editStorage() {
	localStorage.setItem("expenses", JSON.stringify(expenses));
	localStorage.setItem("id", id);
}

modalSubmit.addEventListener("click", () => {
	// validation
	if (modalData.some((e) => e.value == "")) {
		alert("Fill all the fields!!!");
		return;
	}
	if (itemCount.value <= 0) {
		alert("Enter valid count");
		return;
	}

	let finalTotal = Number(itemCost.value) * Number(itemCount.value);

	// CASE 1: EDIT MODE
	if (editingId !== null) {
		let item = expenses.find((x) => Number(x.id) === Number(editingId));

		item.item = itemName.value.trim();
		item.cost = Number(itemCost.value);
		item.count = Number(itemCount.value);
		item.total = finalTotal;

		editStorage();
		updateTotalExp();

		// update card UI instantly

		let card = itemSection.querySelector(`[card-id="${editingId}"]`);
		card.querySelector(".card-item").textContent = item.item;
		card.querySelector(".card-cost").textContent = `₹${item.cost}`;
		card.querySelector(".card-count").textContent = `x${item.count}`;
		card.querySelector(".card-total").textContent = `₹${item.total}`;

		editingId = null; // reset edit mode
		closeTab();
		return;
	}

	// CASE 2: ADD MODE
	let eachExpense = {
		item: itemName.value.trim(),
		cost: Number(itemCost.value),
		count: Number(itemCount.value),
		total: finalTotal,
		id: id++,
	};

	expenses.push(eachExpense);
	editStorage();
	makeCard(eachExpense);
	updateTotalExp();
	closeTab();
});

modalDiscard.addEventListener("click", () => {
	closeTab();
});

// update Total expense

function updateTotalExp() {
	totalExp = expenses.reduce((sum, exp) => sum + Number(exp.total), 0);
	document.querySelector(".total-expense").textContent = `₹${totalExp}`;
}

// Make item cards

function makeCard(expense) {
	const card = document.createElement("div");
	const cardId = expense.id;
	card.className = `item-card`;
	card.setAttribute("card-id", cardId);
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
	itemSection.prepend(card);
}

//Edit item cards

function editEvent(btn) {
	btn.addEventListener("click", (click) => {
		click.stopPropagation();

		const box = btn.closest(".item-card");
		editingId = Number(box.getAttribute("card-id")); // remember which card is editing

		const item = expenses.find((x) => Number(x.id) === Number(editingId));
		modalSubmit.textContent = editingId !== null ? "Save" : "Add";
		modal.style.display = "flex";
		updateModal(item);
	});
}
function updateModal(item) {
	itemName.value = item.item;
	itemCost.value = item.cost;
	itemCount.value = item.count;
	itemTotal.textContent = `₹${item.cost * item.count}`;
}

cardEditBtn.forEach((btn) => {
	if (btn) {
		editEvent(btn);
	}
});

// Delete item cards

function cardDlt(box, cardId) {
	box.remove();
	expenses = expenses.filter((x) => Number(x.id) !== Number(cardId));
}

function dltEvent(btn) {
	btn.addEventListener("click", () => {
		let box = btn.closest(".item-card");
		const cardId = Number(box.getAttribute("card-id"));

		cardDlt(box, cardId);
		editStorage();
		updateTotalExp();
	});
}

cardDltBtn.forEach((btn) => {
	if (btn) {
		dltEvent(btn);
	}
});
