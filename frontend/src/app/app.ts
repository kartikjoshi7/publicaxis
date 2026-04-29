import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { CopilotChat } from './components/copilot-chat/copilot-chat';
import { VisionValidator } from './components/vision-validator/vision-validator';
import { KycRadar } from './components/kyc-radar/kyc-radar';
import { MisinfoSentinel } from './components/misinfo-sentinel/misinfo-sentinel';
import { InfraTracker } from './components/infra-tracker/infra-tracker';

@Component({
  selector: 'app-root',
  imports: [CommonModule, CopilotChat, VisionValidator, KycRadar, MisinfoSentinel, InfraTracker],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  activeTab = signal('copilot');

  ngOnInit() {
    this.titleService.setTitle('PublicAxis | AI-Powered Election Education & Civic Access');
    this.metaService.addTags([
      { name: 'description', content: 'Comprehensive voter education platform' },
      { name: 'keywords', content: 'Election 2026, Voter Rights, Form 6 Validation, AI GovTech' },
      { property: 'og:title', content: 'PublicAxis | AI-Powered Election Education' },
      { property: 'og:image', content: 'https://publicaxis.com/assets/og-image.jpg' }
    ]);
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
  }
}
