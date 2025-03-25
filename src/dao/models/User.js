import mongoose from 'mongoose';
import { createHash } from '../../utils/index.js';

const collection = 'Users';

const schema = new mongoose.Schema({
    first_name:{
        type: String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type:String,
        default:'user'
    },
    pets:{
        type:[
            {
                _id:{
                    type:mongoose.SchemaTypes.ObjectId,
                    ref:'Pets'
                }
            }
        ],
        default:[]
    }
});

schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); 
    this.password = await createHash(this.password); 
    next();
});

const userModel = mongoose.model(collection,schema);
export default userModel;