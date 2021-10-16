import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {

  products=[];
  currentUser
  constructor(private adminService:AdminService,private userService:UserService) { }

  ngOnInit(): void {
    this.currentUser=localStorage.getItem("username")
    this.adminService.getProducts().subscribe(
      res=>{
        this.products=res.message;
      },
      err=>{
        console.log("err in reading products ",err)
        console.log("Something went wrong in reading products")
      }
    )
  }
  onProductSelect(productObject)
  {
    let username=localStorage.getItem("username")
    let newUserProductObj={username,productObject}
    this.userService.sendProductToUserCart(newUserProductObj).subscribe(
      res=>{
          alert(res['message'])
          this.userService.updateDataObservable(res['latestCartObj'])
      },
      err=>{
        alert("something went wrong while adding product to cart...")
      }
    )

  }

}