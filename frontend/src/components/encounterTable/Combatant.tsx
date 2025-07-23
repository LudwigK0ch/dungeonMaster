import { getMonster } from "../../dnd5eAPI";

export class Combatant {
	encounter_id = crypto.randomUUID();
	encounter_initiative: number = 0;
	encounter_name: string = "";
	encounter_hit_points: number = 0;
	encounter_armor_class: number = 0;
	index: string = "";
	name: string = "";
	size: string = "";
	type: string = "";
	alignment: string = "";
	armor_class: Array<any> = [];
	hit_points: number = 0;
	hit_points_roll: string = "";
	hit_dice: string = "";
	speed: { [key: string]: string } = {
		walk: "0 ft.",
		fly: "0 ft.",
		swim: "0 ft."
	};
	strength: number = 0;
	dexterity: number = 0;
	constitution: number = 0;
	intelligence: number = 0;
	wisdom: number = 0;
	charisma: number = 0;
	proficiencies: Array<any> = [];
	damage_vulnerabilities: Array<string> = [];
	damage_resistances: Array<string> = [];
	damage_immunities: Array<string> = [];
	condition_immunities: Array<any> = [];
	senses: { [key: string]: string } = {};
	languages: string = "";
	challenge_rating: number = 0;
	proficiency_bonus: number = 0;
	xp: number = 0;
	special_abilities: Array<any> = [];
	actions: Array<any> = [];
	legendary_actions: Array<any> = [];
	image: string = "";
	reactions: Array<any> = [];

	constructor() {}

	static async create(index: string) {
		const combatant = new Combatant();
		await combatant.initStats(index);
		return combatant;
	}

	private async initStats(index: string) {
		try {
			const combatant = await getMonster(index);
			this.name = combatant.name;
			this.type = combatant.type;
			this.alignment = combatant.alignment;
			this.armor_class = combatant.armor_class;
			this.hit_points = combatant.hit_points;
			this.hit_points_roll = combatant.hit_points_roll;
			this.hit_dice = combatant.hit_dice;
			this.speed = combatant.speed;
			this.strength = combatant.strength;
			this.dexterity = combatant.dexterity;
			this.constitution = combatant.constitution;
			this.intelligence = combatant.intelligence;
			this.wisdom = combatant.wisdom;
			this.charisma = combatant.charisma;
			this.proficiencies = combatant.proficiencies;
			this.damage_vulnerabilities = combatant.damage_vulnerabilities;
			this.damage_resistances = combatant.damage_resistances;
			this.damage_immunities = combatant.damage_immunities;
			this.condition_immunities = combatant.condition_immunities;
			this.senses = combatant.senses;
			this.languages = combatant.languages;
			this.challenge_rating = combatant.challenge_rating;
			this.proficiency_bonus = combatant.proficiency_bonus;
			this.xp = combatant.xp;
			this.special_abilities = combatant.special_abilities;
			this.actions = combatant.actions;
			this.legendary_actions = combatant.legendary_actions;
			this.image = combatant.image;
			this.reactions = combatant.reactions;
		} catch (error) {
			console.log(error);
		}
	}

	private getCombatantCard() {
		return (
			<>
				<div className="stat-block wide">
					<hr className="orange-border" />
					<div className="section-left">
						<div className="creature-info">
							<div className="creature-heading">
								<h1>{this.encounter_name}</h1>
								<h2>
									{this.type}, {this.alignment}
								</h2>
							</div>
							<img className="creature-image" src={"https://www.dnd5eapi.co" + this.image} alt={`${this.encounter_name} image`} />
						</div>
						<svg height="5" width="100%" className="tapered-rule">
							<polyline points="0,0 400,2.5 0,5"></polyline>
						</svg>
						<div className="top-stats">
							<div className="property-line first">
								<h4>Armor class: </h4>
								<>
									{this.armor_class.map((armor, index) => (
										<p key={"armor_" + index}>
											{armor.value} ({armor.type})
										</p>
									))}
								</>
							</div>
							<div className="property-line">
								<h4>Hit Points: </h4>
								<p>
									{this.encounter_hit_points} ({this.hit_points_roll})
								</p>
							</div>
							<div className="property-line last">
								<h4>Speed: </h4>
								<>
									{Object.keys(this.speed).map((type, index) => (
										<p key={"speed_" + index}>
											{type} {this.speed[type]}
										</p>
									))}
								</>
							</div>
							<svg height="5" width="100%" className="tapered-rule">
								<polyline points="0,0 400,2.5 0,5"></polyline>
							</svg>
							<div className="abilities">
								<div className="ability-strength">
									<h4>STR</h4>
									<p>{this.strength}</p>
								</div>
								<div className="ability-dexterity">
									<h4>DEX</h4>
									<p>{this.dexterity}</p>
								</div>
								<div className="ability-constitution">
									<h4>CON</h4>
									<p>{this.constitution}</p>
								</div>
								<div className="ability-intelligence">
									<h4>INT</h4>
									<p>{this.intelligence}</p>
								</div>
								<div className="ability-wisdom">
									<h4>WIS</h4>
									<p>{this.wisdom}</p>
								</div>
								<div className="ability-charisma">
									<h4>CHA</h4>
									<p>{this.charisma}</p>
								</div>
							</div>
							<svg height="5" width="100%" className="tapered-rule">
								<polyline points="0,0 400,2.5 0,5"></polyline>
							</svg>
							<div className="property-line first">
								<h4>Damage Resistances: </h4>
								<p>{this.damage_resistances.join(", ")}</p>
							</div>
							<div className="property-line first">
								<h4>Damage Immunities: </h4>
								<p>{this.damage_immunities.join(", ")}</p>
							</div>
							<div className="property-line first">
								<h4>Damage Vulnerabilites: </h4>
								<p>{this.damage_vulnerabilities.join(", ")}</p>
							</div>
							<div className="property-line first">
								<h4>Condition Immunities:</h4>
								<p>
									{this.condition_immunities
										.filter((immunity) => immunity && immunity.name)
										.map((immunity, index) => immunity.name)
										.join(", ")}
								</p>
							</div>
							<div className="property-line">
								<h4>Senses</h4>
								<div>
									{Object.keys(this.senses).map((sense) => (
										<p key={sense}>
											{sense} {this.senses[sense]}
										</p>
									))}
								</div>
							</div>
							<div className="property-line">
								<h4>Languages: </h4>
								<p>{this.languages}</p>
							</div>
							<div className="property-line last">
								<h4>Challenge: </h4>
								<p>
									{this.challenge_rating} ({this.xp} XP)
								</p>
							</div>
						</div>
						<svg height="5" width="100%" className="tapered-rule">
							<polyline points="0,0 400,2.5 0,5"></polyline>
						</svg>
						{this.special_abilities
							.filter((ability) => ability && ability.name)
							.map((ability, index) => (
								<div className="property-block" key={`ability_${index}`}>
									<h4>{ability.name}: </h4>
									<p>{ability.desc}</p>
								</div>
							))}
					</div>
					<div className="section-right">
						<div className="actions">
							<h3>Actions</h3>
							{this.actions
								.filter((action) => action && action.name)
								.map((action, index) => (
									<div className="property-block" key={`action_${index}`}>
										<h4>{action.name}: </h4>
										<p>{action.desc}</p>
									</div>
								))}
						</div>
						<div className="actions">
							<h3>Legendary Actions</h3>
							{this.legendary_actions
								.filter((action) => action && action.name)
								.map((action, index) => (
									<div className="property-block" key={`legendary_action_${index}`}>
										<h4>{action.name}: </h4>
										<p>{action.desc}</p>
									</div>
								))}
						</div>
					</div>
					<hr className="orange-border bottom" />
				</div>
			</>
		);
	}
}
