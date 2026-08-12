

// const asyncHandler = (reqHandler) => {

//     (req,res,next)=>{
//         Promise.resolve(reqHandler(req,res,next)).reject((error)=> next(error))
//     }
// } 


const asyncHandler = (func) = async(req,res,next)=>{
    try {
        await func(req,res,next)
    } catch (error) {
        res.status((error.code||500).json({
            success:false,
            message:error.message
    }))
    }
}

export {asyncHandler}