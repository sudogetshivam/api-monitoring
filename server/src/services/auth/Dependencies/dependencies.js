import { authController } from "../controller/authController.js";
import { authService } from "../service/authService.js";

import mongooUserRepository from "../repository/userRepository.js";
import mongooUserRepository from "../repository/userRepository.js";

class Container{
    static init(){
        const repositories = {
            UserRepository:mongooUserRepository
        };

        const services = {
            AuthService: new authService(repositories.userRepository) //yaha pe ham apne dependencies push karte hain, yahi se call hoga
        };

        const controllers = {
            AuthControllers: new authController(services.AuthService)
        }

        return {
            repositories, services, controllers
        }
    }
}

const intiliazed =  Container.init();
export {Container}//yahi exact name hona chaiye import karte waqt
export default intiliazed;//kisi naam se import kara sakte ho like import fsjaldk from ./thisfile