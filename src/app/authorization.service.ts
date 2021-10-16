import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements HttpInterceptor {

  constructor() { }

    intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{

      //write intercept logic here
      let token=localStorage.getItem("token");

      //if token is existed
      if(token){
        //add Bearer token to header of request obj
       const clonedReqObj= req.clone({
          headers:req.headers.set("Authorization",`Bearer ${token}`)
        });
        //pass req obj to either next interceptor or to api
        return next.handle(clonedReqObj)
      }
      //if token is not existed
      else{
        return next.handle(req)
      }

       
    }

}