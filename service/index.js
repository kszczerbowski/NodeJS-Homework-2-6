import { Contact } from "./schemas/contact.js";
import { User } from "./schemas/user.js";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";

const addContact = ({ name, phone, email, favorite }) =>
  Contact.create({ name, phone, email, favorite });

const getAllContacts = () => Contact.find({});

const getContactById = (id) => Contact.findOne({ _id: id });

const getAllIds = () => Contact.find({}).distinct("_id");

const removeContact = (id) => Contact.findOneAndDelete({ _id: id });

const updateContact = (id, contact) =>
  Contact.findOneAndUpdate({ _id: id }, contact, { new: true });

const updateContactFavorite = (id, body) =>
  Contact.findOneAndUpdate(
    { _id: id },
    { favorite: body.favorite },
    { new: true }
  );

const addUser = async ({ email, password, subscription }) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const avatarURL = gravatar.url(email, { protocol: "https", s: "100" });
  const newUser = await User.create({
    email,
    password: hashedPassword,
    subscription,
    avatarURL,
  });
  const { password: pwd, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
};

const getAllEmails = () => User.find({}).distinct("email");

const loginUser = async ({ email, password: insertedPassword }) => {
  let error;
  const targetUser = await User.findOne({ email });
  const { password: hashedPassword, ...userWithoutPassword } =
    targetUser.toObject();
  if (!bcrypt.compareSync(insertedPassword, hashedPassword))
    error = "password incorrect!";
  return { userWithoutPassword, error };
};

const getUserById = (id) => User.findOne({ _id: id });

export default {
  addContact,
  getAllContacts,
  getContactById,
  getAllIds,
  removeContact,
  updateContact,
  updateContactFavorite,
  addUser,
  getAllEmails,
  loginUser,
  getUserById,
};
