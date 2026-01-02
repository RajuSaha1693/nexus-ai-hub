import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  userInput = '';
  messages = signal<{ role: string; content: string }[]>([]); //declared a signal with object array type and initialized as empty

  sendMessage() {
    if (!this.userInput) return;
    //else update signal : by adding the user and message
    this.messages.update((prev) => [...prev, { role: 'user', content: this.userInput }]);

    //simulate AI response
    setTimeout(() => {
      this.messages.update((prev) => [
        ...prev,
        { role: 'ai', content: 'Processing you request...' },
      ]);
    }, 500);

    this.userInput = '';
  }
}
