import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderbarComponent } from './shared/components/headerbar/headerbar.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { PlcdataComponent } from './pages/plcdata/plcdata.component';

// CDK Modules
import { CdkMenuModule } from '@angular/cdk/menu';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { VariableMonitorModalComponent } from './pages/configuration/components/variable-monitor-modal/variable-monitor-modal.component';
import { VariablesConfigComponent } from './pages/variables-config/variables-config.component';
import { VariablesDatabaseComponent } from './pages/variables-database/variables-database.component';
import { HistoricalVariablesComponent } from './pages/historical-variables/historical-variables.component';
import { HistoricalAlarmsComponent } from './pages/historical-alarms/historical-alarms.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { UsersComponent } from './pages/users/users.component';
import { EmailGroupsComponent } from './pages/email-groups/email-groups.component';
import { AlarmGroupsComponent } from './pages/alarm-groups/alarm-groups.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SidebarComponent,
    HeaderbarComponent,
    MainLayoutComponent,
    PlcdataComponent,
    ConfigurationComponent,
    VariableMonitorModalComponent,
    VariablesConfigComponent,
    VariablesDatabaseComponent,
    HistoricalVariablesComponent,
    HistoricalAlarmsComponent,
    ChartsComponent,
    UsersComponent,
    EmailGroupsComponent,
    AlarmGroupsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    TableModule,
    TagModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    RippleModule,
    PasswordModule,
    CdkMenuModule,
    DialogModule,
    PickListModule,
    DropdownModule,
    ToastModule,
    ChartModule,
    CascadeSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
