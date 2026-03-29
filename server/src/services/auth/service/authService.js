import appError from "../../../shared/utils/appError.js";
import config from "../../../shared/config/index.js";
import jwt from "jsonwebtoken"
import logger from "../../../shared/config/logger.js";


export class AuthService{
    constructor(userRepository){
        if(!userRepository){
            throw new Error("userRepository is required")
        }
        this.userRepository = userRepository //esko repository milega kaise? by dependencies injection
    }

    generateToken(user){
        const{_id,email,username,role,clientId} = user

        //to generate token you need to have payload
        const payload  = {
            userId: _id,
            username,
            email,
            role,
            clientId
        }

        return jwt.sign(payload, config.jwt.secret,{
            expiresIn: config.jwt.expiresIn
        })
    }

    //agar moongsoe object hain, toObject() function use karro nahi toh spread operator
    formatUserResponse(user){
        const userObj = user.toObject?user.toObject():{...user};
        delete userObj.password; //now remove the password 
        return userObj
    }



    async onBoardSuperAdmin(superAdminData){//dekh bhai ye bas ek baar hoga lifetime main, yaha se jo token generate hoga wo use registration endpoint se super admin ka registration kiya jayega
        //but for first time and first super admin, es endpoint se karenge

        try {
            //basically we are checking at first ki kya koi bhi ek bhi user apne system main hain?, agar hain toh ye api-route nahi chalega
            const existingUser = await this.userRepository.findAll();
            if(existingUser && existingUser.length > 0){
                throw new appError("Super admin is disabled",403)
            }

            const user = await this.userRepository.create(superAdminData)

            const token = this.generateToken();

            logger.info("Super admin onboarded successfully", {username: user.username})

            return{
                user: this.formatUserResponse(user),
                token
            }
        } catch (error) {
            logger.error("Error in Onboarding Super admin",error)
            throw error
            
        }

    }
}