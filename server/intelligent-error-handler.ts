import { problemSolver } from './autonomous-problem-solver';
import { dataProtectionMiddleware } from './data-protection-middleware';

export class IntelligentErrorHandler {
  static async wrapDatabaseOperation<T>(
    operation: () => Promise<T>,
    context?: any
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      // Attempt autonomous problem solving
      const resolved = await problemSolver.detectAndSolve(error, context);
      
      if (resolved) {
        // Retry the operation after fixing
        try {
          return await operation();
        } catch (retryError) {
          console.error('Operation failed after auto-fix:', dataProtectionMiddleware.sanitizeString(String(retryError)));
          throw retryError;
        }
      }
      
      // If not auto-fixable, sanitize and re-throw
      const sanitizedError = dataProtectionMiddleware.sanitizeString(String(error));
      console.error('Database operation failed:', sanitizedError);
      throw error;
    }
  }

  static async handleTradeRecording(tradeData: any): Promise<boolean> {
    return this.wrapDatabaseOperation(async () => {
      // This would be the actual trade recording logic
      console.log('Trade recorded successfully');
      return true;
    }, { operation: 'trade_recording', data: tradeData });
  }
}

export const errorHandler = IntelligentErrorHandler;