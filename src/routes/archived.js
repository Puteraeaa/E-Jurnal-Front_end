import Api from '../api';
import Cookies from 'js-cookie';


const token = Cookies.get('token');

export const fetchArchivedData = async () => {
    try {
        const response = await Api.get('admin/students/archived-year', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching archived data:', error);
        throw error;
    }
};
