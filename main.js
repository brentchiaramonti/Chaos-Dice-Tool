var enable_custom_weights = false;
var sides = [
	{
		'value': 1,
		'weight': 1
	},
	{
		'value': 2,
		'weight': 1
	},
	{
		'value': 3,
		'weight': 1
	},
	{
		'value': 4,
		'weight': 1
	},
	{
		'value': 5,
		'weight': 1
	},
	{
		'value': 6,
		'weight': 1
	}
];
var name = '';
var compare = false;
var rolling = false;

toggleCustomWeights();
setSideValues(sides);

function loadCookie()
{
	var data = document.cookie[0];

	try {
		json = JSON.parse(data);

		length = json['sides'].length;

		document.getElementById('dice_sides').value = length;
		updateAmountOfSides(length);
		enable_custom_weights = !json['enable_custom_weights'];
		toggleCustomWeights();
		document.getElementById('die_name').value = json['name'];
		updateSidesValues(json['sides']);
		calculateExpectedValues();
	} catch (e) {
		console.log(e);
	}
}

function updateCookie()
{
	return;
	let sides = document.querySelectorAll('.side_field');
	let side_values = [];
	let weights = document.querySelectorAll('.weight_field');
	for (i = 0; i < sides.length; i++) {
		let temp = {};
		if (enable_weight) {
			temp['weight'] = parseInt(weights[i].value);
		} else {
			temp['weight'] = 1;
		}
		temp['value'] = parseInt(sides[i].value);
		side_values.push(temp);
	}
	let something = {};
	something['enable_custom_weights'] = document.getElementById('enable_weight').checked;
	something['name'] = document.getElementById('die_name').value;
	something['sides'] = side_values;
	console.log(JSON.stringify(something));
	let thing_to_set = 'dice=' + encodeURIComponent(JSON.stringify([something]));
	console.log(thing_to_set);
	document.cookie = thing_to_set;
	console.log(JSON.stringify(document.cookie));
	document.cookie = "test=something;";
}

function toggleCompare()
{
	compare = !compare;

	if (compare) {
		document.getElementById('sides').classList.remove('expand');
		document.getElementById('sides').classList.add('shrink');
		document.getElementById('comparison_section').classList.add('expand');
		document.getElementById('comparison_section').classList.remove('shrink');
		document.getElementById('compare_button').innerHTML = 'Edit';
	} else {
		document.getElementById('sides').classList.add('expand');
		document.getElementById('sides').classList.remove('shrink');
		document.getElementById('comparison_section').classList.remove('expand');
		document.getElementById('comparison_section').classList.add('shrink');
		document.getElementById('compare_button').innerHTML = 'Compare';
	}
}

function setSideValues(sides) {
	document.getElementById('dice_sides').value = sides.length;
	updateAmountOfSides(sides.length);
	var side_values = document.querySelectorAll('.side_wrapper input.side_field');
	var weight_values = document.querySelectorAll('.side_wrapper input.weight_field');

	for (let i = 0; i < sides.length; i++) {
		side_values[i].value = sides[i]['value'];
		weight_values[i].value = sides[i]['weight'];
	}
	calculateExpectedValues();
}
function toggleCustomWeights() {
	enable_custom_weights = document.getElementById('enable_weight').checked;
	if (enable_custom_weights) {
		document.getElementById('sides').classList.remove('hide_weights');
	} else {
		document.getElementById('sides').classList.add('hide_weights');
	}
	calculateExpectedValues();
	updateCookie();
}

function updateSideOptions() {
	var amount = document.getElementById('dice_sides').value;

	updateAmountOfSides(amount);
	calculateExpectedValues();
	updateCookie();
}

function updateAmountOfSides(amount) {
	var sides = document.querySelectorAll('.side_wrapper');

	if (sides.length < amount) {
		amount_to_add = amount - sides.length;
		for (i = 0; i < amount_to_add; i++) {
			var side_wrapper = document.createElement('div');
			side_wrapper.classList.add('side_wrapper');

			var side_label = document.createElement('label');
			side_label.classList.add('side_label');
			side_label.innerHTML = 'Value: '

			var side_field = document.createElement('input');
			side_field.classList.add('side_field');
			side_field.setAttribute("name", "side_field");
			side_field.setAttribute("type", "number");
			side_field.setAttribute("value", "0");
			side_field.onchange = function(){
				calculateExpectedValues();
			};

			var weight_label = document.createElement('label');
			weight_label.classList.add('weight_label');
			weight_label.innerHTML = 'Weight: '

			var weight_field = document.createElement('input');
			weight_field.classList.add('weight_field');
			weight_field.setAttribute("name", "weight_field");
			weight_field.setAttribute("type", "number");
			weight_field.setAttribute("value", "1");
			weight_field.onchange = function(){
				calculateExpectedValues();
			}

			var percentage_label = document.createElement('label');
			percentage_label.classList.add('percentage_label');
			percentage_label.innerHTML = 'Percentage: '

			var percentage = document.createElement('div');
			percentage.classList.add('side_percentage');
			percentage.innerHTML = "0%";

			side_label.appendChild(side_field);
			weight_label.appendChild(weight_field);
			percentage_label.appendChild(percentage);

			side_wrapper.appendChild(side_label);
			side_wrapper.appendChild(weight_label);
			side_wrapper.appendChild(percentage_label);

			document.getElementById("sides").appendChild(side_wrapper);
		}
	} else if (sides.length > amount) {
		amount_to_remove = sides.length - amount;
		for (i = sides.length - 1; i >= amount; i-- ) {
			sides[i].remove();
		}
	}
}

function calculatePercentages(weights) {
	let total = 0;
	for (let i = 0; i < weights.length; i++) {
		total += parseInt(weights[i].value);
	}
	let percentages = [];

	for (let i = 0; i < weights.length; i++) {
		percentages.push(weights[i].value / total);
	}

	return percentages;
}

function setPercentages(percentages) {
	let divs = document.querySelectorAll('.side_percentage');
	for (let i = 0; i < divs.length; i++) {
		let num = (percentages[i] * 100)
		divs[i].innerHTML =  num.toFixed(2) + '%';
	}
}

function calculateExpectedValues() {
	var sides = document.querySelectorAll('.side_field');
	var side_values = [];
	for (i = 0; i < sides.length; i++) {
		side_values.push(parseInt(sides[i].value));
	}

	var weights = document.querySelectorAll('.weight_field');
	var percentages = calculatePercentages(weights);
	setPercentages(percentages);

	if (enable_custom_weights) {
		let new_sides = [];
		for (let i = 0; i < side_values.length; i++) {
			for (let j = 0; j < parseInt(weights[i].value); j++) {
				new_sides.push(side_values[i]);
			}
		}
		side_values = new_sides;
	}

	var advantage_side_values = calculateAdvantageValues(side_values);
	var disadvantage_side_values = calculateDisadvantageValues(side_values);

	var expected_value = calculateExpectedValue(side_values);
	var advantage_expected_value = calculateExpectedValue(advantage_side_values);
	var disadvantage_expected_value = calculateExpectedValue(disadvantage_side_values);


	var standard_deviation = calculateStandardDeviation(side_values);
	var advantage_standard_deviation = calculateStandardDeviation(advantage_side_values);
	var disadvantage_standard_deviation = calculateStandardDeviation(disadvantage_side_values);

	document.getElementById('expected_value').innerHTML = expected_value.toFixed(2);
	document.getElementById('advantage_expected_value').innerHTML = advantage_expected_value.toFixed(2);
	document.getElementById('disadvantage_expected_value').innerHTML = disadvantage_expected_value.toFixed(2);

	document.getElementById('standard_deviation').innerHTML = standard_deviation.toFixed(2);
	document.getElementById('advantage_standard_deviation').innerHTML = advantage_standard_deviation.toFixed(2);
	document.getElementById('disadvantage_standard_deviation').innerHTML = disadvantage_standard_deviation.toFixed(2);
	updateCookie();
}
function calculateExpectedValue(side_values) {
	probability = 1/(side_values.length);
	sum = 0;
	for (i = 0; i < side_values.length; i++) {
		sum += probability * parseInt(side_values[i]);
	}

	return sum;
}
function calculateStandardDeviation(side_values) {
	length = side_values.length;
	sum = 0;
	for (i = 0; i < length; i++) {
		sum += parseInt(side_values[i]);
	}

	mean = sum / length

	variance = 0;

	for (i = 0; i < length; i++) {
		difference = parseInt(side_values[i]) - mean;
		difference *= difference;
		variance += difference;
	}

	variance = variance / length;

	standard_deviation = Math.sqrt(variance);

	return standard_deviation
}

function calculateAdvantageValues(side_values)
{
	values = [];
	for (side1 in side_values) {
		for (side2 in side_values) {
			values.push(Math.max(side_values[side1], side_values[side2]));
		}
	}

	return values;
}
function calculateDisadvantageValues(side_values)
{
	values = [];
	for (side1 in side_values) {
		for (side2 in side_values) {
			values.push(Math.min(side_values[side1], side_values[side2]));
		}
	}

	return values;
}

function updateSidesValues(data) {

	var sides = document.querySelectorAll('.side_field');
	var weights = document.querySelectorAll('.weight_field');

	for (i = 0; i < sides.length; i++) {
		sides[i].value = data[i]['value'];
		weights[i].value = data[i]['weight'];
	}
}

function importDie() {
	var data = document.getElementById('import').value;

	try {
		json = JSON.parse(data);

		length = json['sides'].length;

		document.getElementById('dice_sides').value = length;
		updateAmountOfSides(length);
		document.getElementById('enable_weight').checked = json['enable_custom_weights'];
		toggleCustomWeights();
		document.getElementById('die_name').value = json['name'];
		updateSidesValues(json['sides']);
		calculateExpectedValues();
		updateCookie();
	} catch (e) {
		console.log(e);
	}
}
function exportDie() {
	var sides = document.querySelectorAll('.side_field');
	var side_values = [];
	var weights = document.querySelectorAll('.weight_field');
	for (i = 0; i < sides.length; i++) {
		let temp = {};
		if (enable_weight) {
			temp['weight'] = parseInt(weights[i].value);
		} else {
			temp['weight'] = 1;
		}
		temp['value'] = parseInt(sides[i].value);
		side_values.push(temp);
	}
	var data = {};
	data['enable_custom_weights'] = document.getElementById('enable_weight').checked;
	data['name'] = document.getElementById('die_name').value;
	data['sides'] = side_values;
	data = JSON.stringify(data);
	document.getElementById('import').value = data;
}

async function rollDie() {
	if (!rolling) {
		rolling = true;
		var sides = document.querySelectorAll('.side_field');
		var side_values = [];
		var weights = document.querySelectorAll('.weight_field');
		for (i = 0; i < sides.length; i++) {
			let temp = {};
			if (enable_weight) {
				temp['weight'] = parseInt(weights[i].value);
			} else {
				temp['weight'] = 1;
			}
			temp['value'] = parseInt(sides[i].value);
			side_values.push(temp);
		}

		var roll_animation_length = 10;

		for (let i = 0; i < roll_animation_length; i++) {
			length = side_values.length;
			roll_number = Math.floor(Math.random() * length);
			document.getElementById('roll_value').innerHTML = side_values[roll_number]['value'];
			await delay(20);
		}
		rolling = false;
	}
}


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function copy() {
	/* Get the text field */
	var copyText = document.getElementById("import");

	/* Select the text field */
	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */

	 /* Copy the text inside the text field */
	navigator.clipboard.writeText(copyText.value);
}
