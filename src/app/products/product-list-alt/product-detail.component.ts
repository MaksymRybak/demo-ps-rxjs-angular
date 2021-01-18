import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  product$ = this.productService.selectedProduct$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  pageTitle$ = this.product$.pipe(
    map((product) =>
      product ? `Product Detail for: ${product.productName}` : null
    )
  );

  productSuppliers$ = this.productService.selectedProductSuppliers$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) {}
}
