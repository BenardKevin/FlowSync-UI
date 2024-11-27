import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { Category } from '../../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  readonly apiUrl = "http://localhost:8080";

  private productsSubject = new BehaviorSubject<Category[]>([]);
  public products = this.productsSubject.asObservable();

  constructor(private http: HttpClient) { }

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`)
      .pipe(
        catchError(() => {
          this.productsSubject.error('An error occurred while fetching categories.');
          return [];
        }),
        map((categories) => {
          // traitement des données avant de mettre à jour l'état courant
          return categories;
        })
      );
  }
}
