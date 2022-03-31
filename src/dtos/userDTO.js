export default class UserDTO{
    constructor(user){
        this.id = user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.username = user.username;
        this.address = user.address;
        this.age = user.age;
        this.role = user.role;
        this.phone = user.phone;
        this.cart = user.cart;
        this.avatar = user.avatar;
        this.password = user.password;
        this.full_name = `${user.first_name} ${user.last_name}`;

    }
}