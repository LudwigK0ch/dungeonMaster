const BASE_URL = "https://www.dnd5eapi.co/api/2014";

export const getMonster = async (monsterIndex: string) => {
	const response = await fetch(`${BASE_URL}/monsters/${monsterIndex}`);
	const monster = await response.json();
	
	return monster;
};
