import User from "../../model/user/UserSchema.js";
import sharp from "sharp";

const updateUser = async (req, res) => {
  const id = req.user._id;

  try {
    const user = await User.findById(id);
    const { firstName, lastName, age, bio, country, city, social, languages } =
      req.body;

    const updateFields = {};

    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (age) updateFields.age = age;
    if (bio) updateFields.bio = bio;
    if (country) updateFields.country = country;
    if (city) updateFields.city = city;
    if (social) updateFields.social = social;
    if (languages) updateFields.languages = languages;

    if (req.file) {
      // Read uploaded image file with sharp
      const image = sharp(req.file.path);

      // Resize image to 500px width and convert to JPEG format with 90% quality
      const resizedImage = await image
        .resize(500)
        .jpeg({ quality: 90 })
        .toBuffer();

      // Save the optimized image to a new file with a unique name
      const filename = `${req.file.filename.split(".")[0]}_optimized.jpg`;
      const path = `public/upload/images/${filename}`;
      await sharp(resizedImage).toFile(path);

      // Update profilePicture field with the new file information
      updateFields.profilePicture = { name: filename, path: path };
    }

    const updateUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updateUser)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default updateUser;
