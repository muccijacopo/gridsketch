import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {

  @Output() clearAll = new EventEmitter<void>();
  @Output() switch = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
