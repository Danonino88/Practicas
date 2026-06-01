import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TaskDTO } from '../../models/task.mode';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatIconModule],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {
  todo: TaskDTO[] = [];
  done: TaskDTO[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.todo = tasks.filter(t => !t.isCompleted);
        this.done = tasks.filter(t => t.isCompleted);
      },
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  drop(event: CdkDragDrop<TaskDTO[]>) {
    if (event.previousContainer === event.container) {
      // Movimiento dentro de la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Movimiento entre columnas (Cambio de estado)
      const task = event.previousContainer.data[event.previousIndex];

      // Llamada al Backend para persistir el cambio
      this.taskService.completeTask(task.id).subscribe({
        next: () => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        },
        error: (err) => console.error('No se pudo actualizar la tarea', err)
      });
    }
  }
}