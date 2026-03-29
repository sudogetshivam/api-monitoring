import baseRepository from "./baseRepository.js";
import User from "../../../shared/models/User.js";
import logger from "../../../shared/config/logger.js";
class mongooUserRepository extends baseRepository{
    constructor(){
        //ek chiz notice kiya agar main constructor me argument main User pass kardu toh mera class us argument 
        //ko use karega na ki jo import kiya hu
        super(User); //this is our mongoose database which we are passing to the base repository, so that we can use it in our base repository methods
    
        //now this.model = User
    }



    async create(userData){
        let data = {...userData} //copy all properties of userData to data (shallow copy) 
        try {
            if(data.role === "super_admin" && !data.permissions){
                data.permissions = {
                    canCreateApiKeys: true,
                    canManageUsers: true,
                    canViewAnalytics: true,
                    canExportData: true,
                }
            }
            
            //remember it just creates a new mongo document doesnt saves it
            const user = this.model(data); //this is as same as const user = new User(data) 
            
            await user.save();
            logger.info("User created successfully ",{username: user.username})
            return user
            
        } catch (error) {
            logger.error("Error in creating user in userRepository", error)
            throw error;
            
        }
    }

    async findById(userId){
        try{
            const user = await this.model.findById(userId)
            return user;
        }
        catch(error){
            logger.error("Error in Finding User by Id," , error)
            throw error;
        }
    }

    async findByUsername(username){
        try {
            const user = await this.model.findOne({usernmae:username})
        } catch (error) {
            logger.error("Error finding user by username",error);
        }
    }

    async findByEmail(email){
        try {
            const user = await this.model.findOne({email:email});
            return user;
        } catch (error) {
            logger.error("Error finding user by email",error)
            throw error
        }
    }

    async findAll(){
        try {
            const user = await this.model.find({isActive: true});
            return user;
        } catch (error) {
            logger.error("Error in findind the user by all method", error)
            throw error
        }
    }

}

// Create ONE instance (object) and export it
//like import userRepo from "userRepository.js"
// userRepo = new mongooUserRepository()
//userRepo.create() ==> you can access this directly
export default new mongooUserRepository();