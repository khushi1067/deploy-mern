const bcrypt=require('bcrypt');
const UserModel=require('../Models/User.js')
const jwt=require('jsonwebtoken')


const signup=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const user=await UserModel.findOne({email});
        if(user){
            return res.status(409)
                .json({message:'User already exist',success:false});

        }
        const userModel=new UserModel({name,email,password});
        userModel.password=await bcrypt.hash(password,10);
        await userModel.save();
        res.status(201)
            .json({
                message:"Signup sucessfully",
                success:true
            })
    }catch(err){
        res.status(500)
            .json({
                message:"Internal Server error",
                success:false
            })
    }
}

const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await UserModel.findOne({email});
        const errorMsg='Authentication Failed'
        if(!user){
            return res.status(403)
                .json({message:errorMsg,success:false});

        }
       
        const isPassEqual=await bcrypt.compare(password,user.password);
        if(!isPassEqual){
            return res.status(403)
            .json({message:errorMsg,success:false});
        }

        const jwtToken=jwt.sign({email:user.email, _id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        )
        res.status(200)
            .json({
                message:"Login sucessfully",
                success:true,
                jwtToken,
                email,
                name:user.name
            })
    }catch(err){
        res.status(500)
            .json({
                message:"Internal Server error",
                success:false
            })
    }
}


const logout = async (req, res) => {
    try {
        // Extract the token from the 'Authorization' header directly without 'Bearer' prefix
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(400).json({ message: 'Token is missing' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            const userId = decoded._id; // Assuming the _id is part of the token payload
            if (!userId) {
                return res.status(400).json({ message: 'User ID is missing from the token' });
            }

            // Delete the user from the database
            await UserModel.deleteOne({ _id: userId });

            res.status(200).json({ message: 'Successfully logged out and user deleted' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging out and deleting user', error: err });
    }
};


module.exports = { login, signup, logout };
