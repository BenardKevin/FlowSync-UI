import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LIST_CONFIG } from '../list-view.config';
import { BaseListViewComponent } from '../base-list-view.component';
import { Contact } from '../../../model/contact';
import { ContactService } from '../../../service/contact/contact.service';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: '../list-view.component.html',
  styleUrl: '../list-view.component.scss',
  providers: [{
        provide: LIST_CONFIG,
        useValue: {
            pageSize: 10,
            sortable: true,
            filterable: true,
            columns: [
                { key: 'lastname', label: 'Nom', sortable: true, filterable: true },
                { key: 'firstname', label: 'Prénom', sortable: true, filterable: true },
                { key: 'email', label: 'Email', sortable: true, filterable: true }
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
                this.cachedItems = this.items;
            }
        );
    }

    protected override sortBy(column: string): void {
        super.sortBy(column);
        
        if(this.sortOrder == 0) {
            switch(column) {
                case 'lastname':
                    this.items.sort((a, b) => a.lastname.localeCompare(b.lastname));
                    break;
                case 'firstname':
                    this.items.sort((a, b) => a.firstname.localeCompare(b.firstname));
                    break;
                case 'email':
                    this.items.sort((a, b) => a.email.localeCompare(b.email));
                    break;
            }
        }

        else if(this.sortOrder == 1) {
            this.items.reverse();
        }

        else {
            this.items.sort((a, b) => a.id - b.id);
        }
    }
    
    protected override delete(id: number): void {
        super.delete(id);
        this.contactService.deleteContact(id).subscribe({
            next: data => {
                console.log('Delete successful');
                this.loadContacts();
            },
            error: error => {
                console.error('There was an error!', error);
            }
        });
    }
}