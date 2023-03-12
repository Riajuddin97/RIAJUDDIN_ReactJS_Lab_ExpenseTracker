import IItem from "../model/IItem";
import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL
//function to get items from backend

const getItems = async () => {
    const response = await axios.get<IItem[]>(`${baseUrl}/items`)
    return response.data
};

const postItem = async (item: Omit<IItem, 'id'>) => {
    const response = await axios.post<IItem>(`${baseUrl}/items`,
        item, {
        headers: {
            'Contet-Type': 'application/json'
        }
    });
    return response.data
};
export {
    getItems,
    postItem
}