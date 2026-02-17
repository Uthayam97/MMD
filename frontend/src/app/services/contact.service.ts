import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ContactPayload } from "../models/contact.model";

@Injectable({ providedIn: "root" })
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contact`;
  constructor(private http: HttpClient) {}
  submit(payload: ContactPayload): Observable<ContactPayload> { return this.http.post<ContactPayload>(this.apiUrl, payload); }
}
