const userModel = require('../Models/userModel')
const profileModel = require('../Models/profileModel')
const currentDate = new Date()


let month = currentDate.getMonth() + 1;
if (month > 12) {
  month = 1;
}
if (month < 10) {
  month = "0" + month;
}
let year = currentDate.getFullYear();
let date = currentDate.getDate();
const fullDate = `${date}/${month}/${year}`;


function displayTime() {
  const currentDate = new Date();
  let hour = currentDate.getHours();
  if (hour < 10) {
    hour = "0" + hour;
  }
  let minute = currentDate.getMinutes();
  let AmorPm = hour < 12 ? "AM" : "PM";
  if (minute < 10) {
    minute = "0" + minute;
  }
  const full_time = `${hour + 1}:${minute} ${AmorPm}`;
  return { full_time };
}

setInterval(function() {
  const { full_time } = displayTime();
  // console.log(full_time);
},10000);

const fullTime = displayTime().full_time

function generateRandomNumber(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalizeFirstLetters(str) {
  return str.replace(/\b\w/g, function(char) {
    return char.toUpperCase();
  });
}
capitalizeFirstLetters('shallom ekunadyo')

const registerWuthGoogle = async (req, res) => {
  try {
    const reqDets = req.user;
    const findEmail = await userModel.findOne({ email: reqDets._json.email });

    // Check if any documents were found with the given email
    if (findEmail) {
      return res.status(409).json('An account already exists with this email');
    }

    const fullName = capitalizeFirstLetters(reqDets._json.name);
    const firstLetter = fullName.charAt(0).toUpperCase();
    const lastLetter = fullName.charAt(-1).toUpperCase();
    const randomNumber = generateRandomNumber(4);
    const userId = `A${firstLetter}${lastLetter}${randomNumber}`;
  
    const newUser = new userModel({
      id: userId,
      name: fullName,
      email: reqDets._json.email,
      gender: 'M', 
      fullTime, 
      fullDate
    });

    await newUser.save();

    // Assuming profileModel is defined and saving user profile is necessary
    const newProfile = new profileModel({
      id: newUser._id,
      name: newUser.name,
      number: newUser.number,
      email: newUser.email,
      gender: newUser.gender,
      age: newUser.age // Assuming age is available in the userModel
    });

    await newProfile.save();
  } catch (error) {
    console.error(error);
    return res.status(500).json('An error occurred while registering');
  }
};







module.exports = {registerWuthGoogle}