import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class App {
  protected readonly title = signal('PublicAxis');
  activeTab = signal('copilot');

  setTab(tab: string) {
    this.activeTab.set(tab);
  }
}
