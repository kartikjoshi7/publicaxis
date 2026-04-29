import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-copilot-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './copilot-chat.html',
  styleUrls: ['./copilot-chat.css']
})
export class CopilotChat {
  private api = inject(Api);
  query = signal('');
  messages = signal<{role: 'user' | 'ai', text: string}[]>([]);
  loading = signal(false);

  sendMessage() {
    if (!this.query().trim()) return;
    const userQuery = this.query();
    this.messages.update(m => [...m, {role: 'user', text: userQuery}]);
    this.query.set('');
    this.loading.set(true);

    this.api.sendChatMessage(userQuery).subscribe({
      next: (res: any) => {
        this.messages.update(m => [...m, {role: 'ai', text: res.response}]);
        this.loading.set(false);
      },
      error: (err) => {
        this.messages.update(m => [...m, {role: 'ai', text: 'Error connecting to the Copilot.'}]);
        this.loading.set(false);
      }
    });
  }
}
