import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Product } from '../../model/product';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:8080/products';

  private productsSubject = new BehaviorSubject<Product[]>([]);
  public readonly products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient, private authentication: AuthenticationService) { }

  /**
   * Fetches the list of all products from the API.
   * Updates the internal product state on success.
   *
   * @returns Observable<Product[]> - Observable emitting the list of products.
   */
  public getProducts(): Observable<Product[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);
    
    return this.http.get<Product[]>(this.apiUrl, { 'headers': headers }).pipe(
      catchError((error) => this.handleError(error, `Failed to fetch products`)),
      tap((products) => this.productsSubject.next(products))
    );
  }

  /**
   * Fetches a single product by its ID.
   *
   * @param id - The ID of the product to fetch.
   * @returns Observable<Product> - Observable emitting the requested product.
   */
  public getProduct(id: number): Observable<Product> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);

    return this.http.get<Product>(`${this.apiUrl}/${id}`, { 'headers': headers }).pipe(
      catchError((error) => this.handleError(error, `Failed to fetch product with ID ${id}`))
    );
  }

  /**
   * Deletes a product by its ID.
   * Updates the internal product state by removing the deleted product.
   *
   * @param id - The ID of the product to delete.
   * @returns Observable<void> - Observable that completes when the deletion is successful.
   */
  public deleteProduct(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { 'headers': headers }).pipe(
      catchError((error) => this.handleError(error, `Failed to delete product with ID ${id}`)),
      tap(() => {
        const updatedProducts = this.productsSubject.getValue().filter(p => p.id !== id);
        this.productsSubject.next(updatedProducts);
      })
    );
  }

  /**
   * Updates multiple products in parallel.
   *
   * @param products - An array of partial product objects with updated fields.
   * @returns Observable<Product[]> - Observable emitting the list of updated products.
   */
  public updateProducts(products: Partial<Product>[]): Observable<Product[]> {
    const updateRequests = products.map(product =>
      this.updateProduct(product.id!, product)
    );

    return forkJoin(updateRequests).pipe(
      catchError((error) => this.handleError(error, 'Failed to update products')),
      tap((updatedProducts) => {
        this.productsSubject.next(updatedProducts);
      })
    );
  }

  /**
   * Updates a single product by its ID.
   * Updates the internal product state with the modified product.
   *
   * @param id - The ID of the product to update.
   * @param productData - Partial product data containing fields to update.
   * @returns Observable<Product> - Observable emitting the updated product.
   */
  public updateProduct(id: number, productData: Partial<Product>): Observable<Product> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);

    return this.http.put<Product>(`${this.apiUrl}/${id}`, productData, { 'headers': headers }).pipe(
      catchError((error) => this.handleError(error, 'Failed to update product')),
      tap((updatedProduct) => {
        const currentProducts = this.productsSubject.getValue();
        const updatedProducts = currentProducts.map(product =>
          product.id === id ? { ...product, ...updatedProduct } : product
        );
        this.productsSubject.next(updatedProducts);
      })
    );
  }

  /**
   * Creates a new product and adds it to the product list.
   * Updates the internal product state by appending the new product.
   *
   * @param product - The product data to create.
   * @returns Observable<Product> - Observable emitting the created product.
   */
  public createProduct(product: any): Observable<Product> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authentication.getToken()}`);
    
    return this.http.post<Product>(this.apiUrl, product, { 'headers': headers }).pipe(
      catchError((error) => this.handleError(error, 'Failed to create product')),
      tap((newProduct) => {
        const updatedProducts = [...this.productsSubject.getValue(), newProduct];
        this.productsSubject.next(updatedProducts);
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
