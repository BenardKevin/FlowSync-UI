import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../../model/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  readonly apiUrl = "http://localhost:8080";

  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  public contacts = this.contactsSubject.asObservable();

  constructor(private http: HttpClient) { }

  public getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/contacts`)
      .pipe(
        catchError(() => {
          this.contactsSubject.error('An error occurred');
          return [];
        }),
        map((contacts) => {
          // traitement des données avant de mettre à jour l'état courant
          return contacts;
        })
      );
  }
  
  public getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/contacts/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Failed to fetch contact with ID ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  public deleteContact(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contacts/${id}`);
  }

  public updateContactById(id: number, value: any): Observable<any>  {
    return this.http.put(`${this.apiUrl}/contacts/${id}`, value, { responseType: 'text' })
    .pipe(
      map(response => {
        try {
          return JSON.parse(response);
        } catch {
          return { message: response };
        }
      }),
      catchError(error => {
        console.error('Update failed:', error);
        return throwError(() => new Error('Update failed'));
      })
    );
  }
}
