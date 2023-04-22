import {Review, User} from "../user/model.js"
import {v4 as uuidv4 } from "uuid"

export const getUserProfile = async (req,res) =>{
    const {id} = req.params
    try {
        const  checkUser = await User.findOne({"user.uid": id})
        if(checkUser) {
            const {auth, pass, user, user_block, email, uid, ...userDataPublic} = checkUser.user
            return res.json({status: true, userDataPublic })
        } else  return res.json({status: false, message: "El usuario no existe."})
    } catch (error) {
        res.json({status: false, error })
    }
}

export const getUserReview = async (req,res) =>{
    const {id} = req.params
    try {
        const  checkUser = await Review.find({by: id})
        if(checkUser.length > 0) {
            const count = await Review.countDocuments({by: id})
            const ratings = await Review.aggregate([
                {
                    $match: { by: id }
                },
                {
                    $group: {
                        _id: "$rating",
                        totalRating: { $sum: "$rating" },
                    }
                },
                {
                    $project: {
                        avgRating: { $divide: [ "$totalRating", 5 ] },
                        totalRating: 1
                    }
                }
            ])
            return res.json({status: true, checkUser, quantity_reviews: count, ratings })
        }
        else  return res.json({status: false, message: "No tiene reseñas"})
    } catch (error) {
        console.log(error)
        res.json({status: false, error })
    }
}

export const postUserReview = async (req,res) =>{
    const {id} = req.params
    const {from, plain_text, rating} = req.body.data
    try {
        const uid = uuidv4()
        const  review = new Review({
            reviewId: uid,
            date: Date.now(),
            from,
            by: id,
            plain_text,
            rating
        })
        const checkSave = await review.save()
        if(checkSave) return res.json({status: true, message: 'Se guardo la reseña' })
        else  return res.json({status: false, message: "No se guardo reseña"})
    } catch (error) {
        res.json({status: false, error })
    }
}