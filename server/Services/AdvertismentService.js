const { AdvertismentModel } = require("../DataBase/AdvertismentEntity");

/**
 * Fetch advertisment data by advertisment screenID.
 * @param {string} screenId Name of the advertisment
 * @returns Advertisment data.
 */
async function deleteAdvertismentById(advertismentId) {
  // DELETE FROM Advertisment
  // WHERE AdvertismentId = advertismentId
  return AdvertismentModel.deleteOne({
    _id: advertismentId,
  });
}

/**
 * Update existing advertisment.
 * @param {string} advertismentId 
 * @param {object} updateAdvertismentData 
 * @returns 
 */
async function updateAdvertismentById(advertismentId, updateAdvertismentData) {
  const idFilter = { _id: advertismentId };

  return AdvertismentModel.findOneAndUpdate(idFilter, updateAdvertismentData);
}

/**
 * Add new advertisment.
 * @param {object} advertismentData 
 * @returns 
 */
async function addAdvertisment(advertismentData) {
  const tempAdvertisment = new AdvertismentModel(advertismentData);
  return tempAdvertisment.save();
}

module.exports = {
  deleteAdvertismentById,
  updateAdvertismentById,
  addAdvertisment,
};
