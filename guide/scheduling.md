# Task Scheduling

Schedule recurring tasks with cron expressions, intervals, and timeouts.

## Installation

```bash
bun add @galaxy-stack/orbit-schedule
```

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { ScheduleModule } from '@galaxy-stack/orbit-schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
})
export class AppModule {}
```

## Cron Jobs

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { Cron, CronExpression } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class TaskService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDailyCleanup() {
    console.log('Running daily cleanup...');
  }

  @Cron('0 0 * * 0') // Every Sunday at midnight
  handleWeeklyReport() {
    console.log('Generating weekly report...');
  }

  @Cron('*/5 * * * *') // Every 5 minutes
  handleFrequentTask() {
    console.log('Running every 5 minutes...');
  }
}
```

## Cron Expressions

| Expression | Description |
|------------|-------------|
| `* * * * *` | Every minute |
| `0 * * * *` | Every hour |
| `0 0 * * *` | Every day at midnight |
| `0 0 * * 0` | Every Sunday |
| `0 0 1 * *` | First day of month |
| `*/15 * * * *` | Every 15 minutes |

## Built-in Expressions

```typescript
import { CronExpression } from '@galaxy-stack/orbit-schedule';

CronExpression.EVERY_SECOND
CronExpression.EVERY_MINUTE
CronExpression.EVERY_HOUR
CronExpression.EVERY_DAY_AT_MIDNIGHT
CronExpression.EVERY_WEEK
CronExpression.EVERY_MONTH
CronExpression.EVERY_YEAR
```

## Intervals

```typescript
import { Interval } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class TaskService {
  @Interval(5000) // Every 5 seconds
  handleInterval() {
    console.log('Running every 5 seconds');
  }

  @Interval('metrics', 10000)
  collectMetrics() {
    console.log('Collecting metrics...');
  }
}
```

## Timeouts

```typescript
import { Timeout } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class TaskService {
  @Timeout(5000) // Run once after 5 seconds
  handleTimeout() {
    console.log('Executed once after 5 seconds');
  }

  @Timeout('warmup', 1000)
  warmupCache() {
    console.log('Cache warmed up');
  }
}
```

## Dynamic Scheduling

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { SchedulerRegistry, CronJob } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class DynamicTaskService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(name: string, cronTime: string) {
    const job = new CronJob(cronTime, () => {
      console.log(`Running job: ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }

  getCronJobs() {
    return this.schedulerRegistry.getCronJobs();
  }

  addInterval(name: string, milliseconds: number) {
    const interval = setInterval(() => {
      console.log(`Running interval: ${name}`);
    }, milliseconds);

    this.schedulerRegistry.addInterval(name, interval);
  }
}
```

## Job Options

```typescript
@Cron('0 0 * * *', {
  name: 'daily-cleanup',
  timeZone: 'America/New_York',
})
handleDailyCleanup() {}
```

## Error Handling

```typescript
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron('*/5 * * * *')
  async handleTask() {
    try {
      await this.doWork();
    } catch (error) {
      this.logger.error('Task failed:', error);
      // Optionally notify, retry, etc.
    }
  }
}
```

## Concurrency Control

Prevent overlapping executions:

```typescript
@Injectable()
export class TaskService {
  private isRunning = false;

  @Cron('*/1 * * * *')
  async handleTask() {
    if (this.isRunning) {
      console.log('Previous task still running, skipping...');
      return;
    }

    this.isRunning = true;
    try {
      await this.longRunningTask();
    } finally {
      this.isRunning = false;
    }
  }
}
```
