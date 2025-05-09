const {
  JWTService,
  UploadService,
} = require("../../../infrastructure/services");

class UpdateProfileImage {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async execute(token, image) {
    const userId = JWTService.verify(token).id;
    const uploadedImage = await UploadService.saveProfilePicture(image);
    await this.userDAO.updateProfileImage(userId, {
      path: uploadedImage.path,
      mimetype: uploadedImage.mimetype,
      size: uploadedImage.size,
    });
    return { acknowledged: true };
  }
}

module.exports = UpdateProfileImage;
