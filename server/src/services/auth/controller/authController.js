import { APPLICATION_ROLES } from "../../../shared/constants/roles"
import config from "../../../shared/config.index.js"
import ResponseFormatter from "../../../shared/utils/responseFormatter.js"

export class authController{
    constructor(authService){
        if(!authService){
            throw new Error("authService is requried")
        }
        this.authService = authService
    };

    async onboardSuperAdmin(req,res,next){
        try {
            const {username, email, password} = req.body

            const superAdminData = {
                username, email, password, role:APPLICATION_ROLES.SUPER_ADMIN
            }

            const result = await this.authService.onboardSuperAdmin(superAdminData)

            res.cookie("authToken",result.token,{
                httpOnly: config.cookie.httpOnly,
                secure: config.cookie.secure,
                maxAge:config.cookie.expiresIn
            })

            res.status(201).json(ResponseFormatter.success(result.user, "Super Admin created Sucessfully", 201))
        } 
    }

}