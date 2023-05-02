import { Contact } from "./schemas/contact.js";

const addContact = ({ name, phone, email, favorite }) => Contact.create({ name, phone, email, favorite });

const getAllContacts = () => Contact.find({});

const getContactById = (id) => Contact.findOne({ _id: id });

const getAllIds = () => Contact.find({}).distinct("_id");

const removeContact = (id) => Contact.findOneAndDelete({ _id: id });

const updateContact = (id, contact) => Contact.findOneAndUpdate({ _id: id }, contact, { new: true });

const updateContactFavorite = (id, body) => Contact.findOneAndUpdate({ _id: id }, { favorite: body.favorite }, { new: true });

export default {
  addContact,
  getAllContacts,
  getContactById,
  getAllIds,
  removeContact,
  updateContact,
  updateContactFavorite
}
