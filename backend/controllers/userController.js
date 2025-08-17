import asyncHandler from "../middleware/asyncHandler.js";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import validator from 'validator'

// sign in user 

const authUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id)

         // Renvoie aussi le token dans la réponse JSON
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            
        })
    } else {
        res.status(404)
        throw new Error("Wrong email or password")
    }
})

// sign up user 
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body 

    if(!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1
    })){
        res.status(400)
        throw new Error(
            "password must be at least 8 long, contain at least, one lowercase, one uppercase, one number and one symbol"
        )
    }

    const userExist = await User.findOne({email});

    if(userExist) {
        res.status(400)
        throw new Error("user already exist")
    }

    const user = await User.create({
        name,
        email,
        password,
    })

    if(user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'Logged out successfully' });
})

// get user profile (private)
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })


    } else {
        res.status(404);
        throw new Error('User not found')
    }
})

// update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if(req.body.email && !validator.isEmail(req.body.email)) {
           res.status(400)
           throw new Error('Invalide email')
        }
        if(req.body.password && !validator.isStrongPassword(req.body.password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
             res.status(400);
             throw new Error("password must be at least 8 long, contain at least, one lowercase, one uppercase, one number and one symbol")
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updateUser = await user.save();

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("user not found")
    }
})

// get all users (private admin)

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

// private admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Empêche de supprimer un admin
    if (user.isAdmin) {
        res.status(400);
        throw new Error('Cannot delete admin user');
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({ message: 'User deleted successfully' });
});

// private admin 
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

// update user (private admin)

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Validation email si fourni
    if (req.body.email && !validator.isEmail(req.body.email)) {
        res.status(400);
        throw new Error("Invalid email address");
    }

    // Si c'est un admin et que tu veux empêcher sa rétrogradation
    if (user.isAdmin && req.body.isAdmin === false) {
        res.status(400);
        throw new Error("Cannot remove admin privileges from this user");
    }

    // Mise à jour des champs
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;

    // Mise à jour isAdmin seulement si fourni (et si tu l’autorises)
    if (typeof req.body.isAdmin !== "undefined") {
        user.isAdmin = Boolean(req.body.isAdmin);
    }

    const updatedUser = await user.save();

    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
    });
});


export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}