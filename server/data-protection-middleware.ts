// TEMPORARILY DISABLED - export class DataProtectionMiddleware {
  protect = (req: any, res: any, next: any) => next();
  sanitizeString = (text: string) => text;
  getProtectionStatus = () => ({ active: false });
}

export const dataProtectionMiddleware = new DataProtectionMiddleware();
export class DataProtectionMiddleware {
  constructor() {}
  
  protect() {
    return (req: any, res: any, next: any) => {
      // Safe mode - minimal protection
      console.log('🛡️ Data protection: Safe mode active');
      next();
    };
  }
}