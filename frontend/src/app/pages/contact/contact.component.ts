import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ContactService } from "../../services/contact.service";

@Component({ selector: "app-contact", templateUrl: "./contact.component.html" })
export class ContactComponent {
  submitted = false;
  loading = false;
  successMessage = "";
  form: FormGroup;

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],
      subject: ["", [Validators.required]],
      message: ["", [Validators.required, Validators.minLength(10)]],
    });
  }

  submit(): void {
    this.submitted = true;
    this.successMessage = "";
    if (this.form.invalid) return;
    this.loading = true;
    this.contactService.submit(this.form.value).subscribe({
      next: () => { this.successMessage = "Your message has been sent successfully."; this.form.reset(); this.submitted = false; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
