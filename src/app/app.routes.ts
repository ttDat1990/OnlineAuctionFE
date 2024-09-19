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

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
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
      },
      {
        path: 'search',
        component: SearchItemsComponent,
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
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'items',
        component: AdminItemsComponent,
      },
    ],
  },
];
