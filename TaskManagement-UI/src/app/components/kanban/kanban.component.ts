import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TaskDTO } from '../../models/task.mode';
import { TaskService } from '../../services/task.service';
import { CreateTaskDialogComponent } from './create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent implements OnInit {
  todo: TaskDTO[] = [];
  done: TaskDTO[] = [];

  constructor(
    private readonly taskService: TaskService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.todo = tasks.filter((task) => !task.isCompleted);
        this.done = tasks.filter((task) => task.isCompleted);
      },
      error: (err) => {
        console.error('No se pudieron cargar las tareas', err);
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, { width: '450px' });

    dialogRef.afterClosed().subscribe((task: TaskDTO | undefined) => {
      if (task) {
        this.todo.unshift(task);
      }
    });
  }

  drop(event: CdkDragDrop<TaskDTO[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const movedTask = event.previousContainer.data[event.previousIndex];

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    if (event.container.data === this.done && !movedTask.isCompleted) {
      this.taskService.completeTask(movedTask.id).subscribe({
        next: () => {
          movedTask.isCompleted = true;
        },
        error: (err) => {
          console.error('No se pudo marcar la tarea como completada', err);
        },
      });
    }
  }
}
