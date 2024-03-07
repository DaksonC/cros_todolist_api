import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY || '';

export function generateToken(data: any): string {
  return jwt.sign(data, secretKey, { expiresIn: '1h' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, secretKey);
}
