import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { PlcdataComponent } from './pages/plcdata/plcdata.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { VariablesConfigComponent } from './pages/variables-config/variables-config.component';
import { VariablesDatabaseComponent } from './pages/variables-database/variables-database.component';
import { HistoricalVariablesComponent } from './pages/historical-variables/historical-variables.component';
import { HistoricalAlarmsComponent } from './pages/historical-alarms/historical-alarms.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { UsersComponent } from './pages/users/users.component';
import { EmailGroupsComponent } from './pages/email-groups/email-groups.component';
import { AlarmGroupsComponent } from './pages/alarm-groups/alarm-groups.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'plcdata', component: PlcdataComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'configuration', component: ConfigurationComponent },
      { path: 'variables-config', component: VariablesConfigComponent },
      { path: 'variables-database', component: VariablesDatabaseComponent },
      { path: 'historical-variables', component: HistoricalVariablesComponent },
      { path: 'historical-alarms', component: HistoricalAlarmsComponent },
      { path: 'charts', component: ChartsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'email-groups', component: EmailGroupsComponent },
      { path: 'alarm-groups', component: AlarmGroupsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
