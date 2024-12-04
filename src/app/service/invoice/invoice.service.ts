import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Invoice } from '../../model/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly apiUrl = 'http://localhost:8080/invoices';

  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  public readonly invoices$ = this.invoicesSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Fetches the list of all invoices from the API.
   * Updates the internal invoice state on success.
   *
   * @returns Observable<Invoice[]> - Observable emitting the list of invoices.
   */
  public getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl).pipe(
      catchError((error) => this.handleError(error, `Failed to fetch invoices`)),
      tap((invoices) => this.invoicesSubject.next(invoices))
    );
  }

  /**
   * Fetches a single invoice by its ID.
   *
   * @param id - The ID of the invoice to fetch.
   * @returns Observable<Invoice> - Observable emitting the requested invoice.
   */
  public getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => this.handleError(error, `Failed to fetch invoice with ID ${id}`))
    );
  }

  /**
   * Deletes a invoice by its ID.
   * Updates the internal invoice state by removing the deleted invoice.
   *
   * @param id - The ID of the invoice to delete.
   * @returns Observable<void> - Observable that completes when the deletion is successful.
   */
  public deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => this.handleError(error, `Failed to delete invoice with ID ${id}`)),
      tap(() => {
        const updatedInvoices = this.invoicesSubject.getValue().filter(p => p.id !== id);
        this.invoicesSubject.next(updatedInvoices);
      })
    );
  }

  /**
   * Updates multiple invoices in parallel.
   *
   * @param invoices - An array of partial invoice objects with updated fields.
   * @returns Observable<Invoice[]> - Observable emitting the list of updated invoices.
   */
  public updateInvoices(invoices: Partial<Invoice>[]): Observable<Invoice[]> {
    const updateRequests = invoices.map(invoice =>
      this.updateInvoice(invoice.id!, invoice)
    );

    return forkJoin(updateRequests).pipe(
      catchError((error) => this.handleError(error, 'Failed to update invoices')),
      tap((updatedInvoices) => {
        this.invoicesSubject.next(updatedInvoices);
      })
    );
  }

  /**
   * Updates a single invoice by its ID.
   * Updates the internal invoice state with the modified invoice.
   *
   * @param id - The ID of the invoice to update.
   * @param invoiceData - Partial invoice data containing fields to update.
   * @returns Observable<Invoice> - Observable emitting the updated invoice.
   */
  public updateInvoice(id: number, invoiceData: Partial<Invoice>): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoiceData).pipe(
      catchError((error) => this.handleError(error, 'Failed to update invoice')),
      tap((updatedInvoice) => {
        const currentInvoices = this.invoicesSubject.getValue();
        const updatedInvoices = currentInvoices.map(invoice =>
          invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
        );
        this.invoicesSubject.next(updatedInvoices);
      })
    );
  }

  /**
   * Creates a new invoice and adds it to the invoice list.
   * Updates the internal invoice state by appending the new invoice.
   *
   * @param invoice - The invoice data to create.
   * @returns Observable<Invoice> - Observable emitting the created invoice.
   */
  public createInvoice(invoice: any): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice).pipe(
      catchError((error) => this.handleError(error, 'Failed to create invoice')),
      tap((newInvoice) => {
        const updatedInvoices = [...this.invoicesSubject.getValue(), newInvoice];
        this.invoicesSubject.next(updatedInvoices);
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
