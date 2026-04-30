/**
 * PublicAxis — Omni-Civic Copilot Component
 * Multilingual conversational AI for election process education.
 * Features voice I/O, 7 Indian languages, and step-by-step civic guidance.
 */
import { Component, inject, signal, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Api } from '../../services/api';
import { ToastService } from '../../services/toast';
import { ImageUtils } from '../../services/image-utils';
import { ChatMessage, ChatResponse } from '../../models/api.models';

/** Supported language configuration for multilingual voice I/O. */
interface LanguageOption {
  code: string;
  name: string;
}

@Component({
  selector: 'app-copilot-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './copilot-chat.html',
  styleUrls: ['./copilot-chat.css']
})
export class CopilotChat implements OnInit, OnDestroy {
  private api = inject(Api);
  private toast = inject(ToastService);
  private imageUtils = inject(ImageUtils);

  query = signal('');
  messages = signal<ChatMessage[]>([]);
  loading = signal(false);

  // Audio & Voice State
  isAudioEnabled = signal(true);
  isListening = signal(false);
  usedMicrophone = signal(false);
  showScrollButton = signal(false);
  showSettingsSheet = signal(false);
  
  /** Supported Indian languages for multilingual civic assistance. */
  languages: LanguageOption[] = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'Hindi (हिंदी)' },
    { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)' },
    { code: 'ta-IN', name: 'Tamil (தமிழ்)' },
    { code: 'te-IN', name: 'Telugu (తెలుగు)' },
    { code: 'mr-IN', name: 'Marathi (मराठी)' },
    { code: 'bn-IN', name: 'Bengali (বাংলা)' }
  ];
  selectedLang = signal('en-IN');
  
  private recognition: any = null;

  ngOnInit(): void {
    const savedLang = localStorage.getItem('copilot_lang');
    if (savedLang) {
      this.selectedLang.set(savedLang);
    }
    this.initSpeechRecognition();
  }

  /** Update selected language and persist to localStorage. */
  onLanguageChange(lang: string): void {
    this.selectedLang.set(lang);
    localStorage.setItem('copilot_lang', lang);
  }

  ngOnDestroy(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /** Initialize the Web Speech API for voice input. */
  initSpeechRecognition(): void {
    const SpeechRecog = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecog) {
      this.recognition = new SpeechRecog();
      this.recognition!.continuous = false;
      this.recognition!.interimResults = false;
      this.recognition!.lang = 'en-IN';

      this.recognition!.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.query.set(transcript);
        this.isListening.set(false);
      };

      this.recognition!.onerror = () => {
        this.isListening.set(false);
      };

      this.recognition!.onend = () => {
        this.isListening.set(false);
      };
    }
  }

  /** Toggle voice listening on/off. */
  toggleListening(): void {
    if (!this.recognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }
    
    if (this.isListening()) {
      this.recognition.stop();
      this.isListening.set(false);
    } else {
      this.recognition.lang = this.selectedLang();
      this.recognition.start();
      this.isListening.set(true);
      this.usedMicrophone.set(true);
    }
  }

  /** Toggle text-to-speech audio output. */
  toggleAudio(): void {
    this.isAudioEnabled.set(!this.isAudioEnabled());
    if (!this.isAudioEnabled() && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /** Speak the AI response aloud using the Web Speech Synthesis API. */
  speakResponse(text: string): void {
    if (!this.isAudioEnabled() || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.selectedLang();
    
    const voices = window.speechSynthesis.getVoices();
    const localizedVoice = voices.find(v => v.lang === this.selectedLang() || v.lang.includes(this.selectedLang().split('-')[0]));
    if (localizedVoice) {
      utterance.voice = localizedVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }

  /** Send the user's query to the Copilot API and display the response. */
  sendMessage(): void {
    if (!this.query().trim()) return;
    const userQuery = this.query();
    this.messages.update(m => [...m, { role: 'user', text: userQuery }]);
    this.query.set('');
    this.loading.set(true);

    const langName = this.languages.find(l => l.code === this.selectedLang())?.name || 'English';

    this.api.sendChatMessage(userQuery, langName).subscribe({
      next: (res: ChatResponse) => {
        const responseText = res.response;
        this.messages.update(m => [...m, { role: 'ai', text: responseText }]);
        this.loading.set(false);
        this.imageUtils.triggerHaptic();
        
        if (this.usedMicrophone()) {
          this.speakResponse(responseText);
          this.usedMicrophone.set(false);
        }
      },
      error: () => {
        this.messages.update(m => [...m, { role: 'ai', text: 'Error connecting to the Copilot.' }]);
        this.loading.set(false);
        this.toast.error('Connection interrupted. Please try again.');
      }
    });
  }

  /** Copy text content to the clipboard. */
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  /** Check if the chat history is scrolled to bottom. */
  checkScroll(): void {
    const container = document.querySelector('.chat-history');
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      this.showScrollButton.set(!isAtBottom);
    }
  }

  ngAfterViewChecked(): void {
    this.checkScroll();
  }

  /** Scroll the chat history container to the bottom. */
  scrollToBottom(): void {
    const history = document.querySelector('.chat-history');
    if (history) {
      history.scrollTop = history.scrollHeight;
    }
  }
}
