import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupName,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  // crated checkout form group
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  //array for credit card years

  creditCardYear: number[] = [];

  //array for credit card month
  creditCardMonth: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  // inject form builder
  constructor(
    private formBuilder: FormBuilder,
    private shopformservice: ShopFormService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {



      // view cart details

    this.reviewCartDetails();
    // created afrom group
    this.checkoutFormGroup = this.formBuilder.group({
      // created a customer group
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWithWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWithWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),

      // for shipping address
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWithWhitespace,
        ]),

        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWithWhitespace,
        ]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),

        zipcode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWithWhitespace,
        ]),
      }),

      // Billing Address
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWithWhitespace,
        ]),

        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWithWhitespace,
        ]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),

        zipcode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWithWhitespace,
        ]),
      }),

      ///credit card Information

      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),

        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWithWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // populate the credit card month

    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth ' + startMonth);

    this.shopformservice.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log('Retrive credit card month :' + JSON.stringify(data));
      this.creditCardMonth = data;
    });

    //populate the credit card year

    this.shopformservice.getCreditCardYears().subscribe((data) => {
      console.log('Retrive credit card yeard :' + JSON.stringify(data));
      this.creditCardYear = data;
    });

    ///populate the countriees

    this.shopformservice.getCountries().subscribe((data) => {
      console.log('Retrive Countries: ' + JSON.stringify(data));
      this.countries = data;
    });
  }


  

  //add getter methord

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  //for last name
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  // for email
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  //add getter methords for shipping address

  //for last name
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.this.zipcode');
  }

  ///Getter methords to acess form control

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipcode');
  }

  // get method for credit card

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );

      //bug Fix for states

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
    
  }



  // review cart details
  reviewCartDetails() {
    // subscribe to cart service.totalQuantity
     this.cartService.totalQuantity.subscribe(
      totalQuantity=> this.totalQuantity = totalQuantity
    
     );

     console.log(this.totalQuantity);
     
    //subscribe to cart servoce.totalProce

    this.cartService.totalPrice.subscribe(

      totalPrice => this.totalPrice = totalPrice
    );
    console.log(this.totalPrice);
    
}

  onSubmit() {
    console.log('handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')!.value);
    console.log(
      'the email address is ' +
        this.checkoutFormGroup.get('customer')!.value.email
    );

    console.log(
      'the shipping address country is ' +
        this.checkoutFormGroup.get('ShippingAddress')!.value.country.name
    );

    console.log(
      'the shipping address sate is ' +
        this.checkoutFormGroup.get('ShippingAddress')!.value.state.name
    );
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYEar: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    //if the current year equals the selected year,then start with the current month

    let startMonth: number;

    if (currentYear === selectedYEar) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopformservice.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log('retrive credit card months ' + JSON.stringify(data));
      this.creditCardMonth = data;
    });
  }

  getStates(formGroupName: string) {
    const FormGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = FormGroup?.value.country.code;
    const countryName = FormGroup?.value.country.name;

    console.log(`${formGroupName} country code : ${countryCode} `);
    console.log(`${formGroupName} country Name : ${countryName} `);

    this.shopformservice.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      //select the first item by default

      FormGroup?.get('state')?.setValue(data[0]);
    });
  }
}
