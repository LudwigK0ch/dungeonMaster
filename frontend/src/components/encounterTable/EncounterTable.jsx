import { useState, useEffect } from "react";
import { rollD20, rollDice } from "../../rollDice";
import { Combatant } from "../encounterTable/Combatant";
import "./CombatantPopup.css";

const EncounterTable = () => {
	const [combatants, setCombatants] = useState([]);
	const [userInput, setUserInput] = useState("");
	const [allMonsters, setAllMonsters] = useState([]);
	const [filteredMonsters, setFilteredMonsters] = useState([]);
	const [currentCombatantIndex, setCurrentCombatantIndex] = useState(-1);
	const [selectedCombatant, setSelectedCombatant] = useState(null);
	const [showPopup, setShowPopup] = useState(false);

	// Fetch all monsters when the component mounts
	useEffect(() => {
		const fetchMonsters = async () => {
			try {
				const response = await fetch("https://www.dnd5eapi.co/api/monsters");
				const data = await response.json();
				setAllMonsters(
					data.results.map(function (monster) {
						return {
							name: monster.name,
							index: monster.index
						};
					})
				); // Store monster names and indexes
			} catch (error) {
				console.error("Error fetching monsters:", error);
			}
		};
		fetchMonsters();
	}, []);

	// Filter monsters dynamically based on user input
	useEffect(() => {
		if (userInput.length > 0) {
			setFilteredMonsters(allMonsters.filter((monster) => monster.name.toLowerCase().startsWith(userInput.toLowerCase())));
		} else {
			setFilteredMonsters([]);
		}
	}, [userInput, allMonsters]);

	/**
	 * Addition/removal/update of new combatants
	 */

	async function addCombatant(combatantName) {
		const requestedCombatant = allMonsters.find((monster) => monster.name == combatantName);
		let index;
		if (requestedCombatant) {
			index = requestedCombatant.index;
		} else {
			console.log(`Monster with name ${combatantName} can not be found. Adding default combatant.`);
		}

		const combatant = await Combatant.create(index);

		combatant.encounter_initiative = rollD20();
		combatant.encounter_name = combatant.name ? combatant.name : combatantName;
		combatant.encounter_hit_points = combatant.hit_points_roll ? rollDice(combatant.hit_points_roll) : 0;
		combatant.encounter_armor_class = combatant.armor_class.length > 0 ? combatant.armor_class[0].value : 0;

		setCombatants([...combatants, combatant]);
	}

	const removeCombatant = (id) => {
		setCombatants((prevCombatants) => {
			const index = prevCombatants.findIndex((c) => c.encounter_id === id);
			const newCombatants = prevCombatants.filter((c) => c.encounter_id !== id);

			// If the list is empty after removal, reset index
			if (newCombatants.length === 0) {
				setCurrentCombatantIndex(0);
				return newCombatants;
			}

			// Adjust currentIndex if the removed combatant was before or at the currentIndex
			setCurrentCombatantIndex((prevIndex) => {
				if (index < prevIndex) return prevIndex - 1; // Shift index back
				if (index === prevIndex) return prevIndex % newCombatants.length; // Stay in bounds
				return prevIndex; // No need to change
			});

			return newCombatants;
		});
	};

	const updateCombatantValue = (encounter_id, field, newValue) => {
		// Do field validations
		switch (field) {
			case "encounter_initiative":
			case "encounter_hit_points":
			case "encounter_armor_class": {
				if (newValue !== "" && isNaN(newValue)) {
					return;
				}
			}

			default:
				break;
		}
		setCombatants((combatants) =>
			combatants.map((c) => {
				if (c.encounter_id === encounter_id) {
					const updated = Object.assign(new Combatant(), c);
					updated[field] = newValue;
					return updated;
				}
				return c;
			})
		);
	};

	const showCombatantDetails = (encounterId) => {
		const combatant = combatants.find((c) => c.encounter_id === encounterId);
		if (combatant) {
			setSelectedCombatant(combatant);
			setShowPopup(true);
		}
	};

	const closePopup = () => {
		setShowPopup(false);
		setSelectedCombatant(null);
	};

	/**
	 * Encounter buttons
	 */
	const startEncounter = () => {
		setCombatants((prevCombatants) => [...prevCombatants].sort((a, b) => b.encounter_initiative - a.encounter_initiative));
		setCurrentCombatantIndex(0);
	};

	const nextCombatant = () => {
		setCurrentCombatantIndex((prevIndex) => (prevIndex + 1) % combatants.length);
	};

	const saveEncounter = () => {
		const jsonString = JSON.stringify(combatants, null, 2); // Pretty-print JSON
		const blob = new Blob([jsonString], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = "combatants.json";
		a.click();

		URL.revokeObjectURL(url); // Cleanup
	};

	const loadEncounter = (event) => {
		const file = event.target.files[0]; // Get the selected file
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const loadedCombatants = JSON.parse(e.target.result);
				if (Array.isArray(loadedCombatants)) {
					const hydrated = loadedCombatants.map((c) => Object.assign(new Combatant(), c));
					setCombatants(hydrated); // <- Now with class methods restored
				} else {
					alert("Invalid JSON format!");
				}
			} catch (error) {
				alert("Error loading JSON: " + error.message);
			}
		};
		reader.readAsText(file);
	};

	return (
		<div className="container py-3">
			{/* Controls Section */}
			<div className="row mb-3">
				<div className="col-md-6">
					<div className="input-group input-group-sm">
						<input
							type="text"
							className="form-control"
							placeholder="Add combatant"
							list="monster-suggestions"
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
						/>
						<datalist id="monster-suggestions">
							{filteredMonsters.map((monster, index) => (
								<option key={monster.index} value={monster.name} />
							))}
						</datalist>
						<button className="btn btn-outline-secondary" onClick={() => addCombatant(userInput)}>
							Add
						</button>
					</div>
				</div>

				<div className="col-md-6 d-flex justify-content-end gap-2">
					<button className="btn btn-outline-secondary" onClick={saveEncounter}>
						Save encounter
					</button>
					<label htmlFor="formFile" className="btn btn-outline-secondary">
						Load encounter
					</label>
					<input className="d-none" type="file" id="formFile" onChange={loadEncounter} />
				</div>
			</div>

			{showPopup && selectedCombatant && (
				<div className="popup-overlay" onClick={closePopup}>
					<div className="popup-content" onClick={(e) => e.stopPropagation()}>
						<button className="close-btn" onClick={closePopup}>
							×
						</button>
						{selectedCombatant.getCombatantCard()}
					</div>
				</div>
			)}
			{/* Combatants Table */}
			<div className="table-responsive">
				<table className="table table-striped table-bordered">
					<thead>
						<tr>
							<th>Initiative</th>
							<th>Name</th>
							<th>HP</th>
							<th>AC</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{combatants.length > 0 ? (
							combatants.map((c, index) => (
								<tr key={c.encounter_id} className={index === currentCombatantIndex ? "table-danger" : ""}>
									<td>
										<input
											type="text"
											className="form-control"
											value={c.encounter_initiative}
											onChange={(e) => updateCombatantValue(c.encounter_id, "encounter_initiative", e.target.value)}
										/>
									</td>
									<td>
										<input
											type="text"
											className="form-control"
											value={c.encounter_name}
											onChange={(e) => updateCombatantValue(c.encounter_id, "encounter_name", e.target.value)}
										/>
									</td>
									<td>
										<input
											type="text"
											className="form-control"
											value={c.encounter_hit_points}
											onChange={(e) => updateCombatantValue(c.encounter_id, "encounter_hit_points", e.target.value)}
										/>
									</td>
									<td>
										<input
											type="text"
											className="form-control"
											value={c.encounter_armor_class}
											onChange={(e) => updateCombatantValue(c.encounter_id, "encounter_armor_class", e.target.value)}
										/>
									</td>
									<td>
										<div className="d-flex">
											<button className="btn btn-outline-danger btn-sm" onClick={() => removeCombatant(c.encounter_id)}>
												Kill
											</button>
											<button className="btn btn-outline-warning btn-sm" onClick={() => showCombatantDetails(c.encounter_id)}>
												Details
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="5" className="text-center">
									No combatants added
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Encounter Controls */}
			<div className="bg-white py-2 border-top shadow-lg position-sticky bottom-0 w-100">
				<div className="container d-flex justify-content-center gap-3">
					<button className="btn btn-outline-success" onClick={startEncounter}>
						Start Encounter
					</button>
					<button className="btn btn-outline-primary" onClick={nextCombatant}>
						Next Combatant
					</button>
					<button className="btn btn-outline-danger" onClick={() => setCurrentCombatantIndex(-1)}>
						Stop Encounter
					</button>
				</div>
			</div>
		</div>
	);
};

export default EncounterTable;
