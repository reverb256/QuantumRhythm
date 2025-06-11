import CompatibilityDemo from '@/components/CompatibilityDemo';
import HealthMonitorDashboard from '@/components/HealthMonitorDashboard';

export default function CompatibilityTestPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">DDR2-Era Compatibility Testing</h1>
        <p className="text-muted-foreground">
          Comprehensive demonstration of autonomous page monitoring and DDR2-era system compatibility with graceful degradation.
        </p>
      </div>

      <div className="space-y-8">
        <CompatibilityDemo />
        <HealthMonitorDashboard />
      </div>
    </div>
  );
}