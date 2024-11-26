import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LIST_CONFIG } from './list-view.config';
import { BaseListViewComponent } from './base-list-view.component';
import { Contact } from '../../model/contact';
import { ContactService } from '../../service/contact.service';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
  providers: [{
        provide: LIST_CONFIG,
        useValue: {
            pageSize: 10,
            sortable: true,
            filterable: true,
            columns: [
                { key: 'name', label: 'Nom', sortable: true, filterable: true },
                { key: 'firstname', label: 'Prénom', sortable: true, filterable: true },
                { key: 'email', label: 'Email' },
                { key: 'address', label: 'Adresse' },
            ],
            actions: {
                edit: true,
                delete: true,
                view: true
            }
        }
    }]
})
export class ContactListViewComponent extends BaseListViewComponent<Contact> {
    private contactService: ContactService = inject(ContactService);

    ngOnInit(): void {
        this.loadContacts();
    }

    private loadContacts() {
        this.contactService.getContacts().subscribe(
            contacts => {
                this.items = contacts;
            }
        );
    }

    getItemValue(item: Contact, key: string): any {
        return item[key as keyof Contact];
    }
}