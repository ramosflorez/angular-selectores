import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent  implements OnInit {

  public myForm: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]]
  });

  public countriesByRegion: SmallCountry[] = [];
  public borders:SmallCountry[] = [];


  constructor(
    private fb:FormBuilder,
    private countriesSerivice: CountriesService
  ) { }

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions():Region[]{
    return this.countriesSerivice.regions;
  }

  onRegionChange():void{
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap(()=>this.myForm.get('country')?.reset('')),
      tap(()=>this.borders = []),
      switchMap((region) => this.countriesSerivice.getCountriesByRegion(region)),
    )
    .subscribe(countries =>
     {
       this.countriesByRegion = countries
     });

  }

  onCountryChange():void{
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap(()=>this.myForm.get('border')?.reset('')),
      filter((value:string) => value.length > 0),
      switchMap((alphaCode) => this.countriesSerivice.getCountryByAlphaCode(alphaCode)),
      switchMap((country) => this.countriesSerivice.getCountryBorderByCodes(country.borders))
    )
    .subscribe(countries => {
      this.borders = countries;
    });
  }



}
