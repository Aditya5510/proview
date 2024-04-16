const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Link = require("../models/Link");


const getUserDict = (token, user) => {
  return {
    token,
    username: user.username,
    userId: user._id,
    email: user.email,
    phone: user.phone,
    state: user.state,
    college: user.college,
    profile: user.profile,
    
  };
};

const buildToken = (user) => {
  return {
    userId: user._id,
  };
};


const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;
    if (!(username && email && password)) {
      throw new Error("All input required");
    }
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      throw new Error("Email and username must be unique");
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });
    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json({
      ...getUserDict(token, user),
      message: "Registered successfully",
    });
  } catch (err) {
    // console.log(err)
    return res.status(400).json({
      error: err.message,
      message: "This is error while sending email from backend ",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new Error("Email or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email or password incorrect");
    }
    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    console.log(user);
    return res.json(getUserDict(token, user));


  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};
const AddLink = async (req, res) => {
  try {
    // console.log(req.body)
    const { userId, title, url, description } = req.body;
    // console.log(userId, title, url, description);

    const user = await User.findById(userId).populate(
      "Links"
    );
    if (!user) {
      throw new Error("User not found");
    }

    console.log(user.Links);


    for (const link of user.Links) {
      if (link.url === url) {
        throw new Error("Link already exists");
      }
    }

    for (const link of user.Links) {
      if (link.title === title) {
        throw new Error("Profile already exists")
      }
    }

    const link = await Link.create({
      title,
      url,
      description,
      user: userId,
    });
    user.Links.push(link);
    await user.save();

    return res.status(200).json({ succes: true, link });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const GetLinks = (req, res) => {
  try {
    const { userId } = req.body;
    User.findById(userId)
      .populate("Links")
      .exec((err, user) => {
        if (err) {
          throw new Error("User not found");
        }



        return res.status(200).json(user.Links);
      });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

const UpdateLink = async (req, res) => {
  try {
    const { userId, title, url, description } = req.body;
    const user = await User.findById(userId).populate("Links");
    if (!user) {
      throw new Error("User not found");
    }

    // console.log("user", user);
    const tobedelete=user.Links.filter(link => link.title === title);
    // console.log(tobedelete);
  
    const link = user.Links.find(link => link.title === title);
    if (!link) {
      throw new Error("Link not found");
    }

    link.title = title;
    link.url = url;
    link.description = description;
    await link.save();
    return res.status(200).json({ success: true, link });


  }
  catch (err) {
    return res.status(400).json({ error: err.message });
  }
}


const DeleteLink = async (req, res) => {
  try {
    const { userId, title } = req.body;
    // console.log(userId, title);
    const user = await User.findById(userId).populate("Links");
    if (!user) {
      throw new Error("User not found");
    }

    const link = user.Links.find(link => link.title === title);
    if (!link) {
      throw new Error("Link not found");
    }
    
    //remove from user.links array as well
    const index = user.Links.indexOf(link);
    user.Links.splice(index, 1);
    await link.remove();
    await user.save();
    console.log(user);

    return res.status(200).json({ success: true });
  }
  catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

const UpdateImage = async (req, res) => {
  try {

    const { userId, profile } = req.body;
    console.log(userId, profile);
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.profile = profile;
    await user.save();
    return res.status(200).json({ success: true });
  }
  catch (err) {
    return res.status(400).json({ error: err.message });
  }
}


const getLinks =(req,res)=>{
try{
  const {userId} = req.params;
  console.log(userId);
  User.findById(userId)
  .populate("Links")
  .exec((err,user)=>{
    if(err){
      throw new Error("User not found");
    }
    return res.status(200).json(user);
  });
}

catch(err){
  return res.status(400).json({error:err.message});
}
}

const UpdateColor = async (req, res) => {
  try {
    const { userId, color} = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.colour = color;
    await user.save();
    return res.status(200).json({ success: true });
  }
  catch (err) {
    return res.status(400).json({ error: err.message });
  }
}








module.exports = {
  register,
  login,
  AddLink,
  GetLinks,
  UpdateLink,
  DeleteLink,
  UpdateImage,
  getLinks,
  UpdateColor 
}

