import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  {path:'Bingo', component:MainComponent},
  { path: '', redirectTo: '/Bingo', pathMatch: 'full' },
  { path: '**', redirectTo: '/Bingo' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
