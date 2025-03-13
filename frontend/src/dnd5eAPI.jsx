const BASE_URL = "https://www.dnd5eapi.co/api/2014/";

export const getMonster = async (monster) => {
	const response = await fetch(`${BASE_URL}/monsters/${monster}`);
    const data = await response.json();
	
    return data;
}
