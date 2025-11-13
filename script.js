let expenses = localStorage.getItem("expenses")
	? JSON.parse(localStorage.getItem("expenses"))
	: [];
console.log(expenses);

let addBtn = document.querySelector(".add-btn");

// modal

let modal = document.querySelector(".modal");
let modalData = Array.from(modal.querySelectorAll("input"));
let modalTotal = modal.querySelector(".modal-total-cost");
let submitBtn = modal.querySelector(".submit-btn");

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
	itemTotal.textContent = `Rs.${itemCost.value * itemCount.value}`;
});

itemCount.addEventListener("input", () => {
	itemTotal.textContent = `Rs.${itemCost.value * itemCount.value}`;
});

// submission process

submitBtn.addEventListener("click", () => {
	// Check if all fields are filled
	if (modalData.some((e) => e.value == "")) {
		alert("Fill all the fields!!!");
	}

	// Taking values and appending to local storage
	else {
		updateTotalExp();
		let eachExpense = {
			item: itemName.value,
			cost: itemCost.value,
			count: itemCount.value,
			total: itemTotal.textContent.slice(3, itemTotal.textContent.length),
		};
		expenses.push(eachExpense);
		localStorage.setItem("expenses", JSON.stringify(expenses));
		makeCard(eachExpense);
		modal.style.display = "none";
		modal.querySelectorAll("input").forEach((inputBox) => {
			inputBox.value = "";
		});
		modalTotal.textContent = "Rs.0";
	}
});

// update Total expense

function updateTotalExp() {
	totalExp += +itemTotal.textContent.slice(3, itemTotal.textContent.length);
	document.querySelector(".total-expense").textContent = `Rs.${totalExp}`;
}

// Make item cards

function makeCard(expense) {
	const card = document.createElement("div");
	num = expenses.indexOf(expense);
	card.className = `item-card ${num}`;
	card.innerHTML = `<div class="card-item">${expense.item} x${expense.count}</div><div class="card-cost">Cost:Rs.${expense.cost}</div><div class="card-total">Total:Rs.${expense.total}</div>`;
	itemSection.appendChild(card);
	console.log(itemSection);
}
