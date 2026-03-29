export const ROLES = [
    'super_admin',
    'client_admin',
    'client_viewer',
]

export const CLIENT_ROLES = [
    'client_viewer',
    'client_admin'
]

export const APPLICATION_ROLES = {
    SUPER_ADMIN: 'super_admin',
    CLIENT_VIEWER: 'client_viewer'
}

export const isValidClient = ((role)=> CLIENT_ROLES.includes(role));
export const validRole = ((role)=> ROLES.includes(role));