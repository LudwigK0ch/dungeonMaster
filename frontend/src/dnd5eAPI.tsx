const BASE_URL = "https://www.dnd5eapi.co/api/2014";

interface Combatant {
	id: string;
	name: string;
	size: string;
	armor_class: number;
	hit_points: number;
	hit_points_roll: string;
	speed: string;
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
	damage_resistances: string[];
	damage_immunities: string[];
	languages: string;
	special_abilities: string[];
	actions: string[];
	image: string;
	legendary_actions: string[];
	reactions: string[];
}

export const getMonster = async (monsterIndex: string) => {
	const response = await fetch(`${BASE_URL}/monsters/${monsterIndex}`);
	const monsterJSON = await response.json();
	const monster: Combatant = {
		id: crypto.randomUUID(),
		name: monsterJSON.name,
		size: monsterJSON.size,
		armor_class: monsterJSON.armor_class?.[0].value,
		hit_points: monsterJSON.hit_points,
		hit_points_roll: monsterJSON.hit_points_roll,
		speed: monsterJSON.speed.walk,
		strength: monsterJSON.strength,
		dexterity: monsterJSON.dexterity,
		constitution: monsterJSON.constitution,
		intelligence: monsterJSON.intelligence,
		wisdom: monsterJSON.wisdom,
		charisma: monsterJSON.charisma,
		damage_resistances: monsterJSON.damage_resistances,
		damage_immunities: monsterJSON.damage_immunities,
		languages: monsterJSON.languages,
		special_abilities: monsterJSON.special_abilities.map((ability: any) => ability.desc),
		actions: monsterJSON.actions.map((action: any) => action.desc),
		image: monsterJSON.image,
		legendary_actions: monsterJSON.legendary_actions.map((action: any) => action.desc),
		reactions: monsterJSON.reactions
	};

	return monster;
};

export const getDefaultCombatant = () => {
	return {
		id: crypto.randomUUID(),
		name: "",
		size: "",
		armor_class: 0,
		hit_points: 0,
		hit_points_roll: "",
		speed: "",
		strength: 0,
		dexterity: 0,
		constitution: 0,
		intelligence: 0,
		wisdom: 0,
		charisma: 0,
		damage_resistances: [],
		damage_immunities: [],
		languages: "",
		special_abilities: [],
		actions: [],
		image: "",
		legendary_actions: [],
		reactions: []
	};
};
