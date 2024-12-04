import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Contact } from '../../model/contact';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = 'http://localhost:8080/contacts';

  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  public contacts$ = this.contactsSubject.asObservable();

  constructor(private http: HttpClient, private authentication: AuthenticationService) { }

  /**
   * Fetches the list of all contacts from the API.
   * Updates the internal contact state on success.
   *
   * @returns Observable<Contact[]> - Observable emitting the list of contacts.
   */
  public getContacts(): Observable<Contact[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);

    return this.http.get<Contact[]>(this.apiUrl, {'headers': headers}).pipe(
      catchError((error) => this.handleError(error, `Failed to fetch contacts`)),
      tap((contacts) => this.contactsSubject.next(contacts))
    );
  }

  /**
   * Fetches a single contact by its ID.
   *
   * @param id - The ID of the contact to fetch.
   * @returns Observable<Contact> - Observable emitting the requested contact.
   */
  public getContact(id: number): Observable<Contact> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);

    return this.http.get<Contact>(`${this.apiUrl}/${id}`, {'headers': headers}).pipe(
      catchError((error) => this.handleError(error, `Failed to fetch contact with ID ${id}`))
    );
  }

  /**
   * Deletes a contact by its ID.
   * Updates the internal contact state by removing the deleted contact.
   *
   * @param id - The ID of the contact to delete.
   * @returns Observable<void> - Observable that completes when the deletion is successful.
   */
  public deleteContact(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {'headers': headers}).pipe(
      catchError((error) => this.handleError(error, `Failed to delete contact with ID ${id}`)),
      tap(() => {
        const updatedContacts = this.contactsSubject.getValue().filter(p => p.id !== id);
        this.contactsSubject.next(updatedContacts);
      })
    );
  }

  /**
   * Updates multiple contacts in parallel.
   *
   * @param contacts - An array of partial contact objects with updated fields.
   * @returns Observable<Contact[]> - Observable emitting the list of updated contacts.
   */
  public updateContacts(contacts: Partial<Contact>[]): Observable<Contact[]> {
    const updateRequests = contacts.map(contact =>
      this.updateContact(contact.id!, contact)
    );

    return forkJoin(updateRequests).pipe(
      catchError((error) => this.handleError(error, 'Failed to update contacts')),
      tap((updatedContacts) => {
        this.contactsSubject.next(updatedContacts);
      })
    );
  }

  /**
   * Updates a single contact by its ID.
   * Updates the internal contact state with the modified contact.
   *
   * @param id - The ID of the contact to update.
   * @param contactData - Partial contact data containing fields to update.
   * @returns Observable<Contact> - Observable emitting the updated contact.
   */
  public updateContact(id: number, contactData: Partial<Contact>): Observable<Contact> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);

    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contactData, {'headers': headers}).pipe(
      catchError((error) => this.handleError(error, 'Failed to update contact')),
      tap((updatedContact) => {
        const currentContacts = this.contactsSubject.getValue();
        const updatedContacts = currentContacts.map(contact =>
          contact.id === id ? { ...contact, ...updatedContact } : contact
        );
        this.contactsSubject.next(updatedContacts);
      })
    );
  }

  /**
   * Creates a new contact and adds it to the contact list.
   * Updates the internal contact state by appending the new contact.
   *
   * @param contact - The contact data to create.
   * @returns Observable<Contact> - Observable emitting the created contact.
   */
  public createContact(contact: any): Observable<Contact> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);

    return this.http.post<Contact>(this.apiUrl, contact, {'headers': headers}).pipe(
      catchError((error) => this.handleError(error, 'Failed to create contact')),
      tap((newContact) => {
        const updatedContacts = [...this.contactsSubject.getValue(), newContact];
        this.contactsSubject.next(updatedContacts);
      })
    );
  }

  /**
   * Handles HTTP errors by logging and rethrowing them.
   *
   * @param error - The HTTP error response object.
   * @param errorMessage - Custom error message to log.
   * @returns Observable<never> - Throws an error observable with the custom message.
   */
  private handleError(error: HttpErrorResponse, errorMessage?: string) {
    console.error(`${errorMessage}`, error);
    return throwError(() => new Error(errorMessage));
  }
}
