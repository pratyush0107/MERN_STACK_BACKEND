import mongoose,{Schema} from "mongoose";
import mongooseAggregatePanginate from "mongoose-aggregate-paginate-v2"
const videoSchema = new Schema(
    {
        videoFile:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        thumbNail:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        duration:{
            type:Number,
            required:true
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        views:{
            type:Number,
            default:0
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },{timestamps:true})


    videoSchema.plugin(mongooseAggregatePanginate)

    export const video = mongoose.model("video",videoSchema)