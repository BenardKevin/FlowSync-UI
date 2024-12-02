import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Order } from '../../model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'http://localhost:8080/orders';

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Fetches the list of all orders from the API.
   * Updates the internal order state on success.
   *
   * @returns Observable<Order[]> - Observable emitting the list of orders.
   */
  public getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      catchError((error) => this.handleError(error, `Failed to fetch orders`)),
      tap((orders) => this.ordersSubject.next(orders))
    );
  }

  /**
   * Fetches a single order by its ID.
   *
   * @param id - The ID of the order to fetch.
   * @returns Observable<Order> - Observable emitting the requested order.
   */
  public getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => this.handleError(error, `Failed to fetch order with ID ${id}`))
    );
  }

  /**
   * Deletes a order by its ID.
   * Updates the internal order state by removing the deleted order.
   *
   * @param id - The ID of the order to delete.
   * @returns Observable<void> - Observable that completes when the deletion is successful.
   */
  public deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => this.handleError(error, `Failed to delete order with ID ${id}`)),
      tap(() => {
        const updatedOrders = this.ordersSubject.getValue().filter(p => p.id !== id);
        this.ordersSubject.next(updatedOrders);
      })
    );
  }

  /**
   * Updates multiple orders in parallel.
   *
   * @param orders - An array of partial order objects with updated fields.
   * @returns Observable<Order[]> - Observable emitting the list of updated orders.
   */
  public updateOrders(orders: Partial<Order>[]): Observable<Order[]> {
    const updateRequests = orders.map(order =>
      this.updateOrder(order.id!, order)
    );

    return forkJoin(updateRequests).pipe(
      catchError((error) => this.handleError(error, 'Failed to update orders')),
      tap((updatedOrders) => {
        this.ordersSubject.next(updatedOrders);
      })
    );
  }

  /**
   * Updates a single order by its ID.
   * Updates the internal order state with the modified order.
   *
   * @param id - The ID of the order to update.
   * @param orderData - Partial order data containing fields to update.
   * @returns Observable<Order> - Observable emitting the updated order.
   */
  public updateOrder(id: number, orderData: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, orderData).pipe(
      catchError((error) => this.handleError(error, 'Failed to update order')),
      tap((updatedOrder) => {
        const currentOrders = this.ordersSubject.getValue();
        const updatedOrders = currentOrders.map(order =>
          order.id === id ? { ...order, ...updatedOrder } : order
        );
        this.ordersSubject.next(updatedOrders);
      })
    );
  }

  /**
   * Creates a new order and adds it to the order list.
   * Updates the internal order state by appending the new order.
   *
   * @param order - The order data to create.
   * @returns Observable<Order> - Observable emitting the created order.
   */
  public createOrder(order: any): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order).pipe(
      catchError((error) => this.handleError(error, 'Failed to create order')),
      tap((newOrder) => {
        const updatedOrders = [...this.ordersSubject.getValue(), newOrder];
        this.ordersSubject.next(updatedOrders);
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
