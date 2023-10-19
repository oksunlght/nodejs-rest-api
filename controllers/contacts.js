const { Contact } = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");

  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const result = await Contact.findOne({ _id: contactId, owner: userId });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: userId,
    },
    req.body,
    { new: true }
  );

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    req.body,
    { new: true }
  );

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const result = await Contact.findOneAndRemove({
    _id: contactId,
    owner: userId,
  });

  if (!result) {
    throw HttpError(404);
  }

  res.json({ message: "contact deleted" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  removeById: ctrlWrapper(removeById),
  updateById: ctrlWrapper(updateById),
  updateFavorite: ctrlWrapper(updateFavorite),
};
