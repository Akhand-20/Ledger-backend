import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Enter A valid email"],
        unique:[true,"Email already exists"],
        lowercase:true,
        trim:true,//it removes spaces from starting and from the end before sving to to mongo
        match:[/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    username:{
        type:String,
        required:[true,"This field is mandatory"]
    },
    password:{
        type:String,
        required:[true,"This field is mandatory"],
        minlength:[6,"Password must be grater than 6 character"],
        select:false//Do not return this field in queries by default

    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false

    }
},{timestamps:true})

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    this.password =await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword=function(candidatePassword){
    console.log(candidatePassword);
    console.log(this.password);
    return bcrypt.compare(candidatePassword,this.password )
}

const userModel =mongoose.model("user",userSchema)
export default userModel;