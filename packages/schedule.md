# @galaxy-stack/orbit-schedule

Task scheduling with @Cron, @Interval, @Timeout decorators.

## Installation

```bash
bun add @galaxy-stack/orbit-schedule
```

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ScheduleModule } from '@galaxy-stack/orbit-schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
})
export class AppModule {}
```

## @Cron Decorator

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { Cron, CronExpression } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyCleanup() {
    await this.cleanupOldRecords();
  }

  @Cron('0 */2 * * *')
  async everyTwoHours() {
    await this.syncData();
  }

  @Cron(CronExpression.EVERY_MONDAY_AT_9AM)
  async weeklyReport() {
    await this.generateReport();
  }
}
```

## @Interval Decorator

```typescript
@Injectable()
export class MonitorService {
  @Interval(30000)
  async healthCheck() {
    await this.checkServices();
  }

  @Interval('metrics', 60000)
  async collectMetrics() {
    await this.gatherMetrics();
  }
}
```

## @Timeout Decorator

```typescript
@Injectable()
export class StartupService {
  @Timeout(5000)
  async delayedInit() {
    await this.warmupCache();
  }

  @Timeout('notification', 10000)
  async sendStartupNotification() {
    await this.notify('Service started');
  }
}
```

## Dynamic Scheduling

```typescript
import { SchedulerRegistry } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class DynamicTasksService {
  constructor(private scheduler: SchedulerRegistry) {}

  addCronJob(name: string, cronTime: string, callback: () => void) {
    this.scheduler.addCronJob(name, cronTime, callback);
  }

  deleteCronJob(name: string) {
    this.scheduler.deleteCronJob(name);
  }

  getCronJobs() {
    return this.scheduler.getCronJobs();
  }
}
```

## Cron Expressions

| Expression | Description |
|------------|-------------|
| `EVERY_SECOND` | Every second |
| `EVERY_MINUTE` | Every minute |
| `EVERY_HOUR` | Every hour |
| `EVERY_DAY_AT_MIDNIGHT` | Daily at 00:00 |
| `EVERY_WEEK` | Weekly on Sunday |
