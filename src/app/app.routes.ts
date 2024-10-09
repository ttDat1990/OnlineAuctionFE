import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { UserLayoutComponent } from './user/layout/layout.component';
import { HomeComponent } from './user/home/home.component';
import { AdminLayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddItemsComponent } from './user/items/add.component';
import { AdminItemsComponent } from './admin/items/items.component';
import { SearchItemsComponent } from './user/items/search-items.component';
import { ItemDetailComponent } from './user/items/item-detail.component';
import { SellerDetailComponent } from './user/items/seller-detail.component';
import { AllItemsComponent } from './user/items/all-items.component';
import { AuthGuard } from './services/auth.service';
import { FavItemsComponent } from './user/items/fav-items.component';
import { ResetPasswordS1Component } from './reset-password-s1.component';
import { ResetPasswordS2Component } from './reset-password-s2.component';
import { AdminCategoryComponent } from './admin/category/category.component';
import { AdminUserComponent } from './admin/user/user.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'reset-password-s1',
    component: ResetPasswordS1Component,
  },
  {
    path: 'reset-password-s2',
    component: ResetPasswordS2Component,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'add-item',
        component: AddItemsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'search',
        component: SearchItemsComponent,
      },
      {
        path: 'all-items',
        component: AllItemsComponent,
      },
      {
        path: 'fav-items',
        component: FavItemsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'item-detail/:id',
        component: ItemDetailComponent,
      },
      {
        path: 'seller-detail/:sellerUsername',
        component: SellerDetailComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'item',
        component: AdminItemsComponent,
      },
      {
        path: 'category',
        component: AdminCategoryComponent,
      },
      {
        path: 'user',
        component: AdminUserComponent,
      },
    ],
  },
];
