import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {A11yModule} from '@angular/cdk/a11y';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {
   MatButtonModule,
   MatToolbarModule,
   MatIconModule,
   MatBadgeModule,
   MatSidenavModule,
   MatListModule,
   MatGridListModule,
   MatFormFieldModule,
   MatInputModule,
   MatSelectModule,
   MatRadioModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatChipsModule,
   MatTooltipModule,
   MatTableModule,
   MatPaginatorModule,
   MatSortModule,
   MatAutocompleteModule,
   MatBottomSheetModule,
   MatButtonToggleModule,
   MatCardModule,
   MatCheckboxModule,
   MatStepperModule,
   MatDialogModule,
   MatDividerModule,
   MatExpansionModule,
   MatMenuModule,
   MatProgressBarModule,
   MatProgressSpinnerModule,
   MatRippleModule,
   MatSliderModule,
   MatSlideToggleModule,
   MatSnackBarModule,
   MatTabsModule,
   MatTreeModule,
} from '@angular/material';

@NgModule({
   imports: [
      CommonModule,
      A11yModule,
      CdkStepperModule,
      CdkTableModule,
      CdkTreeModule,
      DragDropModule,
      MatButtonModule,
      MatToolbarModule,
      MatIconModule,
      MatSidenavModule,
      MatBadgeModule,
      MatListModule,
      MatGridListModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatRadioModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatChipsModule,
      MatTooltipModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatAutocompleteModule,
      MatBottomSheetModule,
      MatButtonToggleModule,
      MatCardModule,
      MatCheckboxModule,
      MatStepperModule,
      MatDialogModule,
      MatDividerModule,
      MatExpansionModule,
      MatMenuModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatRippleModule,
      MatSliderModule,
      MatSlideToggleModule,
      MatSnackBarModule,
      MatTabsModule,
      MatTreeModule,
      PortalModule,
      ScrollingModule,
   ],
   exports: [
      A11yModule,  
      MatButtonModule,
      MatToolbarModule,
      MatIconModule,
      MatSidenavModule,
      MatBadgeModule,
      MatListModule,
      MatGridListModule,
      MatInputModule,
      MatFormFieldModule,
      MatSelectModule,
      MatRadioModule,
      MatDatepickerModule,
      MatChipsModule,
      MatTooltipModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatAutocompleteModule,
      MatBottomSheetModule,
      MatButtonToggleModule,
      MatCardModule,
      MatCheckboxModule,
      MatStepperModule,
      MatDialogModule,
      MatDividerModule,
      MatExpansionModule,
      MatMenuModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatRippleModule,
      MatSliderModule,
      MatSlideToggleModule,
      MatSnackBarModule,
      MatTabsModule,
      MatTreeModule,
      PortalModule,
      ScrollingModule,
   ],
   providers: [
      MatDatepickerModule,
   ]
})

export class AngularMaterialModule { }