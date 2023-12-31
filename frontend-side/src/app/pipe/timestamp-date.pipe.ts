import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampDate'
})
export class TimestampDatePipe implements PipeTransform {
  transform(timestamp: any): string {
    const date = new Date(timestamp);
    const dateString = date.toDateString();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateString} ${timeString}`;
  }
}
