import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ai } from '../../services/ai';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule, MarkdownModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  private aiService = inject(Ai);
  userInput = '';
  messages = signal<{ role: string; content: string }[]>([]); //declared a signal with object array type and initialized as empty
  loading = signal<boolean>(false);
  selectedModel = signal('xiaomi/mimo-v2-flash:free');
  constructor() {
    effect(() => {
      localStorage.setItem('nexus_history', JSON.stringify(this.messages()));
    });
  }

  sendMessage() {
    if (!this.userInput.trim() || this.loading()) return;
    //else update signal : by adding the user and message
    const userQuery = this.userInput;
    //1.adding the usermessage
    this.messages.update((prev) => [...prev, { role: 'user', content: userQuery }]);

    //2 clear input and start loading
    this.userInput = '';
    this.loading.set(true);

    //api call
    this.aiService.askNexus(userQuery, this.selectedModel()).subscribe({
      next: (response) => {
        this.messages.update((prev) => [...prev, { role: 'ai', content: response.reply }]);
        this.loading.set(false);
      },
      error: (error) => {
        console.log('Error connecting bridge', error);
        this.messages.update((prev) => [
          ...prev,
          { role: 'ai', content: 'Sorry, I have lost conneccting with bridge' },
        ]);
        this.loading.set(false);
      },
    });
  }

  clearChat() {
    this.messages.set([]);
    localStorage.removeItem('nexus_history');
  }
}
