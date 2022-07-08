import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  categoryId: number;
  categoryName: string;
  searchActive: boolean;
  title = 'notificationappYT';

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute, private notificationService: NotificationsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {

    this.searchActive = this.route.snapshot.paramMap.has('keyword');
    if(this.searchActive) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const myKeyword : string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(myKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts() {
    if(this.route.snapshot.paramMap.has('id')) {
      this.categoryId = +this.route.snapshot.paramMap.get('id')!;
      this.categoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      this.categoryId = 1;
      this.categoryName = 'Obst & Gemüse';
    }
    this.productService.getProductList(this.categoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(theProduct);

    this.notificationService.success('Hinzugefügt:', theProduct.name, {
      timeOut: 2000,
      showProgressBar: true
    } );

    this.cartService.addToCart(theCartItem);
  }
}
