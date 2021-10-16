import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-usercart',
  templateUrl: './usercart.component.html',
  styleUrls: ['./usercart.component.css']
})
export class UsercartComponent implements OnInit {
  userCartObj;

  constructor(private  userService:UserService) { }

  ngOnInit(): void {
    let username=localStorage.getItem('username');
    this.userService.getProductsFromUserCart(username).subscribe(
      res=>{
        if(res["message"]==='cart-empty'){
          alert("user cart empty")
        }
        else{
              this.userCartObj=res["message"]
              console.log(this.userCartObj)
        }

      },
      err=>{
        alert("something went wrong")
      }
    )
  }

}
