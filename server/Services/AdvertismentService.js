const { AdvertismentModel } = require("../DataBase/AdvertismentEntity");

/**
 * Fetch advertisment data by advertisment screenID.
 * @param {*} screenId Name of the advertisment
 * @returns Advertisment data.
 */
async function deleteAdvertismentById(advertismentId) {
    // DELETE FROM Advertisment
    // WHERE AdvertismentId = advertismentId
    return AdvertismentModel.deleteOne({
        _id: advertismentId
    });
}

module.exports = {
    deleteAdvertismentById,
}