import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private hc:HttpClient) { }

  //to ad new product
  addNewProduct(newProduct):Observable<any>{

    console.log("new product",newProduct)
    return  this.hc.post("/product/add-product",newProduct)
    
  }


  //to read all products
  getProducts():Observable<any>{

      return this.hc.get('/product/getproducts')

  }
}