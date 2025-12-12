export const PUBLIC_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
}

export const AUTH_ROUTES = {
    MANAGER: '/manager',
    AUTHORIZATION: '/authorization',
    POS: '/pos',
    UNAUTHORIZED: '/unauthorized',
};

// * Manager Routes Section ================================
export const MENU_ROUTES = {
    MENU_HOME: '/manager/menu',
    MENUS: '/manager/menu/menus',
    CREATE_MENU: '/manager/menu/menus/create',
    CATEGORIES: '/manager/menu/categories',
    ITEMS: '/manager/menu/items',
    CREATE_ITEM: '/manager/menu/items/create',
    MODIFIERS: '/manager/menu/modifiers',
    CREATE_MODIFIER: '/manager/menu/modifiers/create',
}

export const DASHBOARD_ROUTES = {
    DASHBOARD: '/manager/dashboard',
    ORDERS: '/manager/orders',
    MENU: '/manager/menu',
    CUSTOMERS: '/manager/customers',
    REPORTS: '/manager/reports',
    SETTINGS: '/manager/settings',
}