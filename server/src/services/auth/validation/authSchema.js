import { isValidRole } from "../../../shared/constants/roles.js";

export const onBoardSuperAdminSchema = {
    username : {
        requried: true,
    },
    email: {
        requried: true,
    },
    password:{
        requried:true,
        minLength: 6
    }

}

export const registrationSchema = {
    username : {
        requried: true,
    },
    email: {
        requried: true,
    },
    password:{
        requried:true,
        minLength: 6
    },
    role:{
        requried: false,
        custom: (value) => {
            if(!value) return null;
            return isValidRole(value)? null: 'Invalid Role'
        }
    },
}

export const loginSchema = {
    username: { required: true},
    password: {requried: true},
}