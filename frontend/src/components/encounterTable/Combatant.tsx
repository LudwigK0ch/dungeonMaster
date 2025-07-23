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
	armor_class: Array<Object> = [];
	hit_points: number = 0;
    hit_points_roll: string = "";
	hit_dice: string = "";
	speed: Object = {
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
    proficiencies: Array<Object> = [];
    damage_vulnerabilities: Array<string> = [];
    damage_resistances: Array<string> = [];
    damage_immunities: Array<string> = [];
    condition_immunities: Array<string> = [];
    senses: Object = {};
    languages: string = "";
    challenge_rating: number = 0;
    proficiency_bonus: number = 0;
    xp: number = 0;
    special_abilities: Array<Object> = [];
    actions: Array<Object> = [];
    legendary_actions: Array<Object> = [];
    image: string = "";
    reactions: Array<Object> = [];

	constructor() {}

    static async create(index: string) {
        const combatant = new Combatant();
        await combatant.initStats(index);
        return combatant;
    }

    private async initStats(index: string){
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
}
