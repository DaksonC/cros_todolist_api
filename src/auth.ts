import jwt from 'jsonwebtoken';

require('dotenv').config();

const secretKey = process.env.SECRET_KEY as string;

export function generateToken(data: any): string {
  return jwt.sign(data, secretKey, { expiresIn: '3h' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, secretKey);
}

export function authenticate(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Token não fornecido');
    }
    const data = verifyToken(token);
    req.userId = data.userId;
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}
