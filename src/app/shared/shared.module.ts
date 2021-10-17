import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ViewProductsComponent } from '../view-products/view-products.component';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
 imports:      [ CommonModule,NgxPaginationModule ],
 declarations: [  ViewProductsComponent],
 exports:      [ CommonModule, FormsModule,NgxPaginationModule]
})
export class SharedModule { }