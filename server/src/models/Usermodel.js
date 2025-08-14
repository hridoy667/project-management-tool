const mongoose = require('mongoose')
const bcrypt= require('bcrypt')


const DataSchema = new mongoose.Schema({
name:{type:String,required:true},
email:{type:String,unique:true,required:true,lowercase:true,trim:true},
password:{type:String,required:true},
role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }
},
{
    versionKey:false,
    timestamps:true
}
);

DataSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,10);
    next();
})
const UserModel = mongoose.model("users", DataSchema)

module.exports = UserModel;