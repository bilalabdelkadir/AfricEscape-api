import { Destination } from "../../model/Destination/Destination.js";

const deleteDestination = async (req, res) => {
  const { id } = req.params;
  try {
    await Destination.findByIdAndDelete(id);
    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default deleteDestination;

// import fs from 'fs/promises';
// import path from 'path';
// import { Destination } from '../../model/Destination/Destination';

// const deleteDestination = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const destination = await Destination.findById(id);
//     if (!destination) {
//       return res.status(404).json({ message: 'Destination not found' });
//     }

//     const { images, coverImage } = destination;
//     await Destination.findByIdAndDelete(id);

//     // delete associated files from storage
//     await Promise.all([
//       ...images.map(filename => fs.unlink(path.join('public', 'upload', 'images', filename))),
//       fs.unlink(path.join('public', 'upload', 'covers', coverImage))
//     ]);

//     res.status(200).json({ message: 'Destination deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
