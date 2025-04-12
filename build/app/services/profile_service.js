import { resetPasswordValidator, updateProfileValidator } from '#validators/profile';
import ResponseHelper from '../helpers/response_helper.js';
import User from '#models/user';
import app from '@adonisjs/core/services/app';
import { cuid } from '@adonisjs/core/helpers';
import { unlink } from 'node:fs/promises';
import logger from '@adonisjs/core/services/logger';
export default class ProfileService {
    static async doResetPassword({ request, auth }) {
        const { oldPassword, password } = await request.validateUsing(resetPasswordValidator);
        const user = auth.user;
        try {
            await User.verifyCredentials(user.email, oldPassword);
        }
        catch (err) {
            return ResponseHelper.badRequestResponse('Password lama salah!');
        }
        try {
            user.password = password;
            await user.save();
            await User.hashPassword(user);
            return ResponseHelper.okResponse(null, 'Password berhasil diubah');
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async update({ request, auth }) {
        const { fullName, email, phone } = await request.validateUsing(updateProfileValidator);
        const user = auth.user;
        try {
            if (user.email !== email) {
                const isEmailExist = await User.isEmailExist(email);
                if (isEmailExist) {
                    return ResponseHelper.badRequestResponse('Email sudah digunakan');
                }
                user.email = email;
            }
            user.fullName = fullName;
            if (phone) {
                const formatedPhone = await User.formatPhoneNumber(phone);
                if (!formatedPhone) {
                    return ResponseHelper.badRequestResponse('Nomor telepon tidak valid');
                }
                user.phone = formatedPhone;
            }
            const avatar = request.file('image');
            if (avatar?.isValid) {
                const oldImage = user.image;
                if (oldImage) {
                    const path = `storage/uploads/${oldImage}`;
                    await unlink(app.makePath(path)).catch((e) => {
                        logger.info(`Failed to delete old profile image: ${e.message}`);
                    });
                }
                const filename = `${cuid()}.${avatar.extname}`;
                const folderPath = 'storage/uploads';
                await avatar.move(app.makePath(folderPath), {
                    name: filename,
                });
                const filePath = `/${folderPath}/${filename}`;
                user.image = filePath;
            }
            await user.save();
            return ResponseHelper.okResponse(null, 'Profil berhasil diubah');
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
}
//# sourceMappingURL=profile_service.js.map