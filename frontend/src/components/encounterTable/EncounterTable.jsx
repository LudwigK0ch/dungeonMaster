import { useState, useEffect } from "react";
import { getMonster } from "../../dnd5eAPI";
import { rollD20, rollDice } from "../../rollDice";

const EncounterTable = () => {
	const [rollInitiative, setRollInitiative] = useState(false);
	const [rollIHP, setRollHP] = useState(false);
	const [combatants, setCombatants] = useState([]);
	const [userInput, setUserInput] = useState("");
	const [allMonsters, setAllMonsters] = useState([]);
	const [filteredMonsters, setFilteredMonsters] = useState([]);
	const [currentCombatantIndex, setCurrentCombatantIndex] = useState(-1);

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

	async function addMonster(monsterName) {
		const requestedMonster = allMonsters.find((monster) => monster.name == monsterName);
		if (!requestedMonster) {
			console.log(`Monster with name ${monsterName} can not be found`);
			return;
		}

		const monster = await getMonster(requestedMonster.index);
		console.log(monster);
		const initiative = rollInitiative ? rollD20() : "";
		const name = monster.name;
		const hp = rollIHP ? rollDice(monster.hit_points_roll) : monster.hit_points;
		const ac = monster.armor_class[0].value;
		const id = crypto.randomUUID();

		setCombatants([
			...combatants,
			{
				initiative: initiative,
				name: name,
				hp: hp,
				ac: ac,
				id: id
			}
		]);
	}

	// Function to update combatant values (HP or Initiative)
	const updateInitiative = (id, value) => {
		setCombatants((combatants) => combatants.map((c) => (c.id === id ? { ...c, initiative: Number(value) || c.initiative } : c)));
	};

	// Function to update combatant values (HP or Initiative)
	const updateHP = (id, value) => {
		setCombatants((combatants) => combatants.map((c) => (c.id === id ? { ...c, hp: Number(value) || c.hp } : c)));
	};

	const updateName = (id, value) => {
		setCombatants((combatants) => combatants.map((c) => (c.id === id ? { ...c, name: value } : c)));
	};

	const updateAC = (id, value) => {
		setCombatants((combatants) => combatants.map((c) => (c.id === id ? { ...c, ac: Number(value) || c.ac } : c)));
	};

	const addEmptyRow = (rollInitiative) => {
		setCombatants([
			...combatants,
			{
				initiative: rollInitiative ? rollD20() : "",
				name: "",
				hp: "",
				ac: "",
				id: crypto.randomUUID()
			}
		]);
	};

	const removeCombatant = (id) => {
		setCombatants((prevCombatants) => {
			const index = prevCombatants.findIndex((c) => c.id === id);
			const newCombatants = prevCombatants.filter((c) => c.id !== id);

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

	const startEncounter = () => {
		setCombatants((prevCombatants) => [...prevCombatants].sort((a, b) => b.initiative - a.initiative));
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
					setCombatants(loadedCombatants); // Update state
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
				<div className="col-md-6 d-flex gap-3">
					<div className="form-check">
						<input className="form-check-input" type="checkbox" id="rollInitiative" onChange={() => setRollInitiative(!rollInitiative)} />
						<label className="form-check-label" htmlFor="rollInitiative">
							Roll initiative
						</label>
					</div>
					<div className="form-check">
						<input className="form-check-input" type="checkbox" id="rollHP" onChange={() => setRollHP(!rollHP)} />
						<label className="form-check-label" htmlFor="rollHP">
							Roll HP
						</label>
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

			{/* Add Combatants Section */}
			<div className="row mb-3">
				<div className="col-md-6">
					<div className="input-group input-group-sm">
						<input
							type="text"
							className="form-control"
							placeholder="Add enemy"
							list="monster-suggestions"
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
						/>
						<datalist id="monster-suggestions">
							{filteredMonsters.map((monster, index) => (
								<option key={index} value={monster.name} />
							))}
						</datalist>
						<button className="btn btn-outline-secondary" onClick={() => addMonster(userInput)}>
							Add
						</button>
					</div>
				</div>
				<div className="col-md-6 d-flex justify-content-end gap-2">
					<button className="btn btn-outline-secondary" onClick={() => addEmptyRow(false)}>
						Add player
					</button>
					<button className="btn btn-outline-secondary" onClick={() => addEmptyRow(rollInitiative)}>
						Add custom enemy
					</button>
				</div>
			</div>

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
								<tr key={c.id} className={index === currentCombatantIndex ? "table-danger" : ""}>
									<td>
										<input type="text" className="form-control" value={c.initiative} onChange={(e) => updateInitiative(c.id, e.target.value)} />
									</td>
									<td>
										<input type="text" className="form-control" value={c.name} onChange={(e) => updateName(c.id, e.target.value)} />
									</td>
									<td>
										<input type="text" className="form-control" value={c.hp} onChange={(e) => updateHP(c.id, e.target.value)} />
									</td>
									<td>
										<input type="text" className="form-control" value={c.ac} onChange={(e) => updateAC(c.id, e.target.value)} />
									</td>
									<td>
										<button className="btn btn-outline-danger btn-sm" onClick={() => removeCombatant(c.id)}>
											Kill
										</button>
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
