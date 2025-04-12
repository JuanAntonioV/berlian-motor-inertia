import vine from '@vinejs/vine';
export const resetPasswordValidator = vine.compile(vine.object({
    oldPassword: vine.string().maxLength(30),
    password: vine.string().maxLength(30).minLength(6),
    confirmPassword: vine.string().maxLength(30).minLength(6).sameAs('password'),
}));
export const updateProfileValidator = vine.compile(vine.object({
    fullName: vine.string().maxLength(50),
    email: vine.string().maxLength(50).email(),
    phone: vine.string().maxLength(15).nullable(),
    image: vine
        .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
    })
        .nullable()
        .optional(),
}));
//# sourceMappingURL=profile.js.map