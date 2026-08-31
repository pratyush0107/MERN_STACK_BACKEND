

// const asyncHandler = (reqHandler) => {

//    return (req,res,next)=>{
//         Promise.resolve(reqHandler(req,res,next)).reject((error)=> next(error))
//     }
// } 


// const asyncHandler = (func) = async(req,res,next)=>{
//     try {
//         await func(req,res,next)
//     } catch (error) {
//         res.status((error.code||500).json({
//             success:false,
//             message:error.message
//     }))
//     }
// }

// export {asyncHandler}

const asyncHandler = (func) => async (req, res) => {
    try {
        await func(req, res);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export { asyncHandler };
