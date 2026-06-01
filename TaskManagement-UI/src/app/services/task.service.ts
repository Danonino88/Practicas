import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskDTO, CreateTaskRequest } from '../models/task.mode';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = '/api/tasks';
constructor(private client: HttpClient) {}

  getTasks(): Observable<TaskDTO[]> {
    return this.client.get<TaskDTO[]>(this.apiUrl);
  }

  createTask(request: CreateTaskRequest): Observable<TaskDTO> {
    return this.client.post<TaskDTO>(this.apiUrl, request);
  }

  completeTask(id: string): Observable<void> {
    return this.client.patch<void>(`${this.apiUrl}/${id}/complete`, {});
  }
}