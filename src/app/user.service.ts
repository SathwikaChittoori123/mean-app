import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  dataSource= new  BehaviorSubject<any>(0)
  dataObservable=this.dataSource.asObservable();
  updateDataObservable(data){
    this.dataSource.next(data);
  }

  userLoginStatus=false;

  constructor(private hc:HttpClient) { 
      }

  createUser(userObj):Observable<any>{
    return  this.hc.post("/user/createuser",userObj)
  }

  loginUser(credentials):Observable<any>{
    return  this.hc.post("/user/login",credentials)
  }




  getUser(username):Observable<any>{
      return this.hc.get(`/user/getuser/${username}`)
  }

  deleteUser(){

  }

  updateUser(){

  }
  sendProductToUserCart(userProductObj){
    return this.hc.post("user/add-to-cart",userProductObj)
  }
  getProductsFromUserCart(username):Observable<any>{
   return  this.hc.get(`/user/getproducts/${username}`)
  }
}