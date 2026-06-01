import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../../services/task.service';
import { CreateTaskRequest, TaskDTO } from '../../../models/task.mode';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './create-task-dialog.component.html',
  styles: [`.full-width { width: 100%; display: block; margin-bottom: 8px; }`],
})
export class CreateTaskDialogComponent {
  saving = false;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateTaskDialogComponent>);
  private readonly taskService = inject(TaskService);
  private readonly snackBar = inject(MatSnackBar);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
  });

  save(): void {
    if (this.form.invalid || this.saving) return;

    this.saving = true;

    const request: CreateTaskRequest = {
      title: this.form.value.title!,
      description: this.form.value.description!,
    };

    this.taskService.createTask(request).subscribe({
      next: (task: TaskDTO) => {
        this.snackBar.open('Tarea creada exitosamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(task);
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Error al crear la tarea. Intenta de nuevo.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
