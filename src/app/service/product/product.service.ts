import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly apiUrl = "http://localhost:8080";

  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products = this.productsSubject.asObservable();

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`)
      .pipe(
        catchError(() => {
          this.productsSubject.error('An error occurred while fetching products.');
          return [];
        }),
        map((products) => {
          // traitement des données avant de mettre à jour l'état courant
          return products;
        })
      );
  }
  
  public getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Failed to fetch product with ID ${id}:`, error);
          return throwError(() => error);
        })
      );
  }
  
  public deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Failed to delete product with ID ${id}:`, error);
          return throwError(() => error);
        })
      );

  }

  public updateProductById(id: number, value: any): Observable<any>  {
    return this.http.put(`${this.apiUrl}/products/${id}`, value, { responseType: 'text' })
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

  importProduct(product: { id: any; name: any; price: any; category_id: any; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product)
    .pipe(
      map(response => {
        return response;
      }),
      catchError((error) => {
        console.error('Error importing product:', error);
        return throwError(() => new Error('Import failed'));
      })
    );
  }
}
