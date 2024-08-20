import Cookies from "js-cookie";

export default function hasAnyPermission(requiredPermissions) {
    try {
        // Get permissions from cookies
        const permissionsStr = Cookies.get('permissions');
        if (!permissionsStr) {
            console.error('Permissions cookie is missing');
            return false;
        }

        // Parse permissions from cookie (expecting an array)
        const allPermissions = JSON.parse(permissionsStr);

        // Check if any of the required permissions exist in the array
        return requiredPermissions.some(permission => allPermissions.includes(permission));
    } catch (error) {
        console.error('Error parsing permissions cookie:', error);
        return false;
    }
}
