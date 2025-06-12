export class DataProtectionMiddleware {
  protect = (req: any, res: any, next: any) => next();
  sanitizeString = (text: string) => text;
  getProtectionStatus = () => ({ active: false });
}

export const dataProtectionMiddleware = new DataProtectionMiddleware();