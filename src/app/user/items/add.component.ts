import { Component } from '@angular/core';
import {
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

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      itemTitle: ['', Validators.required],
      itemDescription: ['', Validators.required],
      minimumBid: ['', Validators.required],
      bidIncrement: ['', Validators.required],
      bidStartDate: ['', Validators.required],
      bidEndDate: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
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
    this.selectedImages = event.target.files;
  }

  onDocumentSelect(event: any) {
    this.selectedDocuments = event.target.files;
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

      this.itemService.createItem(formData).subscribe(
        (response) => {
          console.log('Item created successfully');
          this.router.navigate(['/user/home']);
        },
        (error) => {
          console.error('Error creating item:', error);
        }
      );
    }
  }
}
