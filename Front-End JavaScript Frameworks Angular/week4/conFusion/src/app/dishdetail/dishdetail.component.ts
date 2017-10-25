import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';

import {visibility,flyInOut, expand} from '../animations/app.animation';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  host:{  '[@flyInOut]': 'true',
  'style': 'display: block;'},
animations:[flyInOut(),visibility(),expand()],
  styleUrls: ['./dishdetail.component.scss']

})

export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishCopy=null;
  dishIds: number[];
  prev: number;
  next; number;
  errMess: string;
  visibility = 'shown'; 
 dishfeedbackform: FormGroup;
 dishComment: Comment;

 formErrors = {
    author: '',
    rating: '',
    comment: ''
  };

 validationMessages = {
    author: {
      required: 'Author Name is required.',
      minlength: 'Author Name must be 2 or more characters long.'
    },
    comment: {
      required: 'Comment is required.'
    }
 };

 constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
       this.dishComment = new Comment();
    }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']);})
        .subscribe(dish => {this.visibility = 'shown';this.dish = dish; this.dishCopy=dish;this.setPrevNext(dish.id); },errmess => this.errMess = <any>errmess );
  }

  createForm() {
     this.dishfeedbackform = this.fb.group({
      'author': ['', [Validators.required, Validators.minLength(2)]],
      'rating': 5,
      'comment': ['', Validators.required]
    });

    this.dishfeedbackform.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.dishfeedbackform) { return; }
    
    const form = this.dishfeedbackform;
    for (const field in this.formErrors) {

      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
}
  
 onSubmit() {
    if (this.dishfeedbackform.value) {
      this.dishComment.author = this.dishfeedbackform.value.author;
      this.dishComment.date = new Date().toISOString();
      this.dishComment.comment = this.dishfeedbackform.value.comment;
      this.dishComment.rating = this.dishfeedbackform.value.rating;
      this.dishCopy.comments.push(this.dishComment);
      this.dishCopy.save().subscribe(dish => this.dish = dish);
    }

    this.dishfeedbackform.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }

 setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

 goBack(): void {
    this.location.back();
  }

}