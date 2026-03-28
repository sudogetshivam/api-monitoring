//controller ko chaiye service, service ko chaiye repository, ese liye sabse phele repository banate hai, taki service usko use kar sake

export default class baseRepository{
    //any class extending me must use/implement create, we need to override the methods
    constructor(model){
    this.model = model
    }

    async create(data){
        throw new Error("Method not implemented")
    }

    async findById(data){
        throw new Error("findById Method not implemented")
    }

     async findByUsername(data){
        throw new Error("findByUsername Method not implemented")
    }

      async findByEmail(data){
        throw new Error("findByEmail Method not implemented")
    }
    async findAll(data){
        throw new Error("findAll Method not implemented")
    }
}