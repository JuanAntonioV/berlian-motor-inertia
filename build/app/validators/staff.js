import vine from '@vinejs/vine';
export const staffValidator = vine.compile(vine.object({
    fullName: vine.string().minLength(3).maxLength(255),
    email: vine.string().email(),
    joinDate: vine.date(),
    password: vine.string().minLength(6).maxLength(45),
    roles: vine.array(vine.number()),
    image: vine
        .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
    })
        .nullable()
        .optional(),
    phone: vine.string().minLength(10).maxLength(15),
}));
export const updateStaffValidator = vine.compile(vine.object({
    fullName: vine.string().minLength(3).maxLength(255),
    email: vine.string().email(),
    joinDate: vine.date(),
    password: vine.string().minLength(6).maxLength(45).optional().nullable(),
    roles: vine.array(vine.number()),
    image: vine
        .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
    })
        .nullable()
        .optional(),
    phone: vine.string().minLength(10).maxLength(15),
}));
//# sourceMappingURL=staff.js.map