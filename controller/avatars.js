import path from "path";

const displaySavedImage = async (req, res) => {
  const { fileName } = req.params;
  const filePath = path.resolve(`./public/avatars/${fileName}`);
  res.sendFile(filePath);
};

export default {
  displaySavedImage,
};
