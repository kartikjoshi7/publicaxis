import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
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
export class CopilotChat implements OnInit, OnDestroy {
  private api = inject(Api);
  query = signal('');
  messages = signal<{role: 'user' | 'ai', text: string}[]>([]);
  loading = signal(false);

  // Hyper-Local Audio Governance Signals
  isAudioEnabled = signal(true);
  isListening = signal(false);
  usedMicrophone = signal(false);
  
  private recognition: any = null;

  ngOnInit() {
    this.initSpeechRecognition();
  }

  ngOnDestroy() {
    if (this.recognition) {
      this.recognition.stop();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  initSpeechRecognition() {
    const SpeechRecog = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecog) {
      this.recognition = new SpeechRecog();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN'; // Localized Indian English

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.query.set(transcript);
        this.isListening.set(false);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        this.isListening.set(false);
      };

      this.recognition.onend = () => {
        this.isListening.set(false);
      };
    }
  }

  toggleListening() {
    if (!this.recognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }
    
    if (this.isListening()) {
      this.recognition.stop();
      this.isListening.set(false);
    } else {
      this.recognition.start();
      this.isListening.set(true);
      this.usedMicrophone.set(true); // Track that user utilized voice input
    }
  }

  toggleAudio() {
    this.isAudioEnabled.set(!this.isAudioEnabled());
    if (!this.isAudioEnabled() && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop playing immediately if muted
    }
  }

  speakResponse(text: string) {
    if (!this.isAudioEnabled() || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find localized voice if available
    const voices = window.speechSynthesis.getVoices();
    const localizedVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('en-IN'));
    if (localizedVoice) {
      utterance.voice = localizedVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }

  sendMessage() {
    if (!this.query().trim()) return;
    const userQuery = this.query();
    this.messages.update(m => [...m, {role: 'user', text: userQuery}]);
    this.query.set('');
    this.loading.set(true);

    this.api.sendChatMessage(userQuery).subscribe({
      next: (res: any) => {
        const responseText = res.response;
        this.messages.update(m => [...m, {role: 'ai', text: responseText}]);
        this.loading.set(false);
        
        // Auto-read response if user initiated conversation via microphone
        if (this.usedMicrophone()) {
          this.speakResponse(responseText);
          this.usedMicrophone.set(false); // Reset for next interaction
        }
      },
      error: (err) => {
        this.messages.update(m => [...m, {role: 'ai', text: 'Error connecting to the Copilot.'}]);
        this.loading.set(false);
      }
    });
  }
}
