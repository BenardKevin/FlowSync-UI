import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent {

  eventGuid: number = 0;
  
  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin, 
      timeGridPlugin, 
      listPlugin, 
      interactionPlugin
    ],
    headerToolbar: {
      start: 'prev,next today', // will normally be on the left. if RTL, will be on the right
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' // will normally be on the right. if RTL, will be on the left
    },
    initialView: 'dayGridMonth',
    weekends: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    nowIndicator: true,
    height: "100%",
    businessHours: {
      daysOfWeek: [ 1, 2, 3, 4, 5 ],
    
      startTime: '9:00',
      endTime: '18:00',
    },
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef) { }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;
    let display = 'auto';

    calendarApi.unselect(); // clear date selection

    if (selectInfo.start.getDate() + 1 == selectInfo.end.getDate()) {
      display = 'list-item';
    }

    if (title) {
      calendarApi.addEvent({
        id: this.createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        display: display
      });
    }

  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  createEventId() {
    return String(this.eventGuid++);
  }
}



