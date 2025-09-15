import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Server, Clock } from 'lucide-react';

const Health = () => {
  const healthData = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: "99.99%",
    services: {
      frontend: "operational",
      storage: "operational",
      authentication: "operational"
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">System Health</h1>
          <p className="text-muted-foreground">
            Real-time status of SaaS Notes application
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Overall Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success mb-1">
                {healthData.status.toUpperCase()}
              </div>
              <p className="text-sm text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="w-4 h-4" />
                Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {healthData.uptime}
              </div>
              <p className="text-sm text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                v{healthData.version}
              </div>
              <p className="text-sm text-muted-foreground">
                Latest release
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(healthData.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="capitalize font-medium">{service}</span>
                    <Badge variant={status === 'operational' ? 'default' : 'destructive'}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>JSON Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Health;