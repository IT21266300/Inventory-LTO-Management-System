import jwt from 'jsonwebtoken';

export const generateToken = (member) => {
  return jwt.sign(
    {
      mongoID: member._id,
      name: member.name,
      staffId: member.staffId,
      position: member.position,
      password: member.password,
      phone: member.phone,

    },
    process.env.JWT_SECRET,
    {
      expiresIn: '5d',
    }
  );
};
