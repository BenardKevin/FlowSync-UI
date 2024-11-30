import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  private _listView!: boolean;

  constructor() { }

  get listView() {
    return this._listView;
  }

  set listView(listView: boolean) {
    this._listView = listView;
  }

  toggleView() {
    if (this._listView == undefined) {
      this._listView = true;
    } else {
      this._listView = !this._listView;
    }
    
    return this._listView;
  }
}
