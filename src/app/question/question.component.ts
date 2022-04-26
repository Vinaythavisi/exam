import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  
  public name:string="";
  public QuestionList : any =[];
  public currentQuestion:number =0;
  public points: number=0;
  counter=30;
  correctAnswer:number=0;
  incorrectAnswer:number=0;
  interval$:any;
  progress:string="0";
  isexamcompleted : boolean= false;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name=localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }
  getAllQuestions(){
    this.questionService.getQuestionJson()
    .subscribe(res=>{
      this.QuestionList=res.questions
    })
    }

  nextQuestion(){
    this.currentQuestion++;

  }

  previousQuestion(){
    this.currentQuestion--;
  }
  

  answer(currentQno:number,option:any){

    if(currentQno=== this.QuestionList.length){
       this.isexamcompleted=true;
       this.stopCounter();
    }

    if(option.correct){
      this.points+=10;
      this.correctAnswer++;
      setTimeout(()=>{
       this.currentQuestion++;
       this.resetCounter();
       this.getProgressPercent();
      },1000);
    }
    else{
      setTimeout(()=>{
       this.currentQuestion++;
       this.incorrectAnswer++;
       this.resetCounter();
       this.getAllQuestions();
      },1000);
      this.points-=10;
    }
  }

  startCounter(){
     this.interval$=interval(1000)
     .subscribe(val=>{
       this.counter--;
       if(this.counter===0){
         this.currentQuestion++;
         this.counter=30;
         this.points-=10;
       }
     });
     setTimeout(()=>{
          this.interval$.unsubscribe();
     },300000);
  }

  stopCounter(){
         this.interval$.unsubscribe();
         this.counter=0;
  }

  resetCounter(){
   this.stopCounter();
   this.counter=30;
   this.startCounter();
  }
  
  resetExam(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=30;
    this.currentQuestion=0;
    this.progress="0";
  }
  getProgressPercent(){
    this.progress=((this.currentQuestion/this.QuestionList.length)*100).toString();
    return this.progress;
  }
}
