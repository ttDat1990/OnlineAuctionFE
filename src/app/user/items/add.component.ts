import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddItemsComponent {
  itemForm: FormGroup;
  categories = []; // This will be fetched from API
  selectedImages: File[] = [];
  selectedDocuments: File[] = [];
  errorMessage: string = '';
  imageErrors: { name: string; error: string }[] = [];
  documentErrors: { name: string; error: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.itemForm = this.fb.group(
      {
        itemTitle: ['', Validators.required],
        itemDescription: [''], // Không cần require
        minimumBid: ['', [Validators.required, Validators.min(1)]], // Giá trị dương
        bidIncrement: ['', [Validators.required, Validators.min(1)]], // Giá trị dương
        bidStartDate: ['', [Validators.required, this.bidStartDateValidator]],
        bidEndDate: ['', Validators.required],
        categoryId: ['', Validators.required],
        images: ['', [this.imageValidator.bind(this)]],
        documents: ['', [this.documentValidator.bind(this)]],
      },
      { validators: this.bidEndDateValidator } // Validator kiểm tra bidEndDate > bidStartDate
    );
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    // Fetch the categories from the backend
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  onImageSelect(event: any) {
    const files = event.target.files;
    this.selectedImages = [];
    this.imageErrors = [];

    const allowedExtensions = ['png', 'gif', 'jpg'];
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    for (const file of files) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        this.imageErrors.push({
          name: file.name,
          error: `Invalid file type. (Only .png, .gif, .jpg are allowed.)`,
        });
      } else if (file.size > maxFileSize) {
        this.imageErrors.push({
          name: file.name,
          error: `File size exceeds the 2MB limit.`,
        });
      } else {
        this.selectedImages.push(file);
      }
    }

    // Cập nhật form control để trigger validator
    this.itemForm
      .get('images')
      ?.setValue(this.selectedImages.length ? this.selectedImages : '');
    this.itemForm.get('images')?.markAsTouched();
  }

  onDocumentSelect(event: any) {
    const files = event.target.files;
    this.selectedDocuments = [];
    this.documentErrors = [];

    const allowedExtensions = ['doc', 'docx', 'xls', 'xlsx', 'txt'];
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    for (const file of files) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        this.documentErrors.push({
          name: file.name,
          error: `Invalid file type. (Only .doc, .docx, .xls, .xlsx, .txt are allowed.)`,
        });
      } else if (file.size > maxFileSize) {
        this.documentErrors.push({
          name: file.name,
          error: `File size exceeds the 2MB limit.`,
        });
      } else {
        this.selectedDocuments.push(file);
      }
    }

    this.itemForm
      .get('documents')
      ?.setValue(this.selectedDocuments.length ? this.selectedDocuments : '');
    this.itemForm.get('documents')?.markAsTouched();
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const formData = new FormData();
      formData.append('itemTitle', this.itemForm.get('itemTitle')?.value);
      formData.append(
        'itemDescription',
        this.itemForm.get('itemDescription')?.value
      );
      formData.append('minimumBid', this.itemForm.get('minimumBid')?.value);
      formData.append('bidIncrement', this.itemForm.get('bidIncrement')?.value);
      formData.append('bidStartDate', this.itemForm.get('bidStartDate')?.value);
      formData.append('bidEndDate', this.itemForm.get('bidEndDate')?.value);
      formData.append('categoryId', this.itemForm.get('categoryId')?.value);

      for (const image of this.selectedImages) {
        formData.append('Images', image);
      }

      for (const document of this.selectedDocuments) {
        formData.append('Documents', document);
      }

      this.itemService.createItem(formData).subscribe({
        next: (response) => {
          console.log('Item created successfully');
          this.router.navigate(['/user/home']);
        },
        error: (error) => {
          // Correctly access the error message here
          console.error('Error creating item:', error);
          if (error.status === 400 && error.error?.message) {
            this.errorMessage = error.error.message; // Access the correct 'message' field
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
        },
        complete: () => {
          console.log('Item creation process complete');
        },
      });
    }
  }

  // Custom validator for bidStartDate to be at least 1 day from the current date
  bidStartDateValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const startDate = new Date(control.value);
    const currentDate = new Date();
    // Kiểm tra bidStartDate phải lớn hơn ít nhất 1 ngày so với ngày hiện tại
    if (startDate < new Date(currentDate.setDate(currentDate.getDate() + 1))) {
      return { startDateInvalid: true };
    }
    return null;
  }

  // Custom validator for bidEndDate to be greater than bidStartDate
  bidEndDateValidator(group: FormGroup): { [key: string]: boolean } | null {
    const bidStartDate = group.get('bidStartDate')?.value;
    const bidEndDate = group.get('bidEndDate')?.value;
    if (new Date(bidEndDate) <= new Date(bidStartDate)) {
      return { endDateInvalid: true };
    }
    return null;
  }

  imageValidator(control: AbstractControl): { [key: string]: any } | null {
    if (this.imageErrors.length > 0) {
      return { imageError: true };
    }
    return null;
  }

  documentValidator(control: AbstractControl): { [key: string]: any } | null {
    if (this.documentErrors.length > 0) {
      return { documentError: true };
    }
    return null;
  }
}
