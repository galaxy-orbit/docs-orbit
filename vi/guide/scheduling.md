# Lập lịch tác vụ

Lên lịch cho các tác vụ định kỳ với biểu thức cron, khoảng thời gian và thời gian chờ.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-schedule
```

## Thiết lập

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { ScheduleModule } from '@galaxy-stack/orbit-schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
})
export class AppModule {}
```

## Công việc Cron

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { Cron, CronExpression } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class TaskService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDailyCleanup() {
    console.log('Đang chạy dọn dẹp hàng ngày...');
  }

  @Cron('0 0 * * 0') // Mỗi Chủ Nhật lúc nửa đêm
  handleWeeklyReport() {
    console.log('Đang tạo báo cáo hàng tuần...');
  }

  @Cron('*/5 * * * *') // Mỗi 5 phút
  handleFrequentTask() {
    console.log('Chạy mỗi 5 phút...');
  }
}
```

## Biểu thức Cron

| Biểu thức | Mô tả |
|------------|-------------|
| `* * * * *` | Mỗi phút |
| `0 * * * *` | Mỗi giờ |
| `0 0 * * *` | Mỗi ngày lúc nửa đêm |
| `0 0 * * 0` | Mỗi Chủ Nhật |
| `0 0 1 * *` | Ngày đầu tiên của tháng |
| `*/15 * * * *` | Mỗi 15 phút |

## Biểu thức tích hợp

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

## Khoảng thời gian

```typescript
import { Interval } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class TaskService {
  @Interval(5000) // Mỗi 5 giây
  handleInterval() {
    console.log('Chạy mỗi 5 giây');
  }

  @Interval('metrics', 10000)
  collectMetrics() {
    console.log('Thu thập số liệu...');
  }
}
```

## Thời gian chờ

```typescript
import { Timeout } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class TaskService {
  @Timeout(5000) // Chạy một lần sau 5 giây
  handleTimeout() {
    console.log('Thực thi một lần sau 5 giây');
  }

  @Timeout('warmup', 1000)
  warmupCache() {
    console.log('Bộ nhớ cache đã được khởi động');
  }
}
```

## Lập lịch động

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { SchedulerRegistry, CronJob } from '@galaxy-stack/orbit-schedule';

@Injectable()
export class DynamicTaskService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(name: string, cronTime: string) {
    const job = new CronJob(cronTime, () => {
      console.log(`Đang chạy công việc: ${name}`);
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
      console.log(`Đang chạy khoảng thời gian: ${name}`);
    }, milliseconds);

    this.schedulerRegistry.addInterval(name, interval);
  }
}
```

## Tùy chọn công việc

```typescript
@Cron('0 0 * * *', {
  name: 'daily-cleanup',
  timeZone: 'Asia/Ho_Chi_Minh',
})
handleDailyCleanup() {}
```

## Xử lý lỗi

```typescript
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron('*/5 * * * *')
  async handleTask() {
    try {
      await this.doWork();
    } catch (error) {
      this.logger.error('Tác vụ thất bại:', error);
      // Tùy chọn thông báo, thử lại, v.v.
    }
  }
}
```

## Kiểm soát đồng thời

Ngăn chặn việc thực thi trùng lặp:

```typescript
@Injectable()
export class TaskService {
  private isRunning = false;

  @Cron('*/1 * * * *')
  async handleTask() {
    if (this.isRunning) {
      console.log('Tác vụ trước vẫn đang chạy, bỏ qua...');
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