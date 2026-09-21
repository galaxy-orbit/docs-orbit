# @galaxy-stack/orbit-schedule

Lập lịch tác vụ với decorator @Cron, @Interval, @Timeout.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-schedule
```

## Thiết lập

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ScheduleModule } from '@galaxy-stack/orbit-schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
})
export class AppModule {}
```

## Decorator @Cron

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

## Decorator @Interval

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

## Decorator @Timeout

```typescript
@Injectable()
export class StartupService {
  @Timeout(5000)
  async delayedInit() {
    await this.warmupCache();
  }

  @Timeout('notification', 10000)
  async sendStartupNotification() {
    await this.notify('Dịch vụ đã khởi động');
  }
}
```

## Lập lịch động

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

## Biểu thức Cron

| Biểu thức | Mô tả |
|-----------|------|
| `EVERY_SECOND` | Mỗi giây |
| `EVERY_MINUTE` | Mỗi phút |
| `EVERY_HOUR` | Mỗi giờ |
| `EVERY_DAY_AT_MIDNIGHT` | Hàng ngày lúc 00:00 |
| `EVERY_WEEK` | Hàng tuần vào Chủ nhật |
