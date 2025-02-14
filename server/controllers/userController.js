import userModel from './../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async (req, res)=> {
        try {
    
            const {name, email, password} = req.body;
    
            if(!name || !email || !password) {
                return res.json({success:false, message: "Please fill in all fields."})
            }
    
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const userData = {
                name, email, password:hashedPassword
            }

            const newUser = new userModel(userData)
            const user = await newUser.save()

            const token = jwt.sign({id: user._id},process.env.SECRET_KEY)
            
            res.json({success:true, token, user:{name: user.name}, message: "Registered Successfully!"})
            
        } catch (error) {
            res.json({success:false, message: error.message})
        }
}


const loginUser = async (req, res)=> {
    try {
        
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message:"Fill all fields"})
        }

        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({success:false, message: "User doesnot exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.json({success:false, message: "Password Wrong!"})
        }
        
        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY)
        res.json({success: true, token, user: {name: user.name}, message: "Logged in Successfully"})
        
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

const userCredits = async (req,res)=> {
    try {
        const {userID} = req.body

        const user = await userModel.findById(userID)

        if(!user) {
            return res.status(401).json({message: "Unauthorized" })
        }

        res.json({success:true, credits: user.creditBalance, user: {name: user.name}})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

export {registerUser, loginUser, userCredits}
