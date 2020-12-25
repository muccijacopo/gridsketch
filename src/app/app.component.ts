import { Component, ElementRef, ViewChild } from '@angular/core';
import { StateService } from './state.service';

interface Line {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
  @ViewChild('svg') svgEl!: ElementRef<SVGElement>;
  
  grid: Line[] = [];
  lines: Line[] = [];

  viewBox: string;

  constructor(private stateService: StateService) {
  }

  ngOnInit() {
    // setInterval(() => {
    //   this.viewBox = "0 0 0 0";
    // }, 3000)
  }

  ngAfterViewInit() {
    this.initGrid();
  }

  switch() {
    this.stateService.switch();
  }

  getRelativeXY(x: number, y: number) {
    const { x: parentX, y: parentY } = this.containerRef.nativeElement.getBoundingClientRect();
    const { x: childX, y: childY } = this.svgEl.nativeElement.getBoundingClientRect();
    const offsetX = childX - parentX;
    const offsetY = childY - parentY;
    return { x: x - offsetX, y: y - offsetY }
  }

  initGrid() {
    const { width, height } = this.containerRef.nativeElement.getBoundingClientRect();
    const columns = width / 100;
    const rows = height / 100;
    for (let c = 0; c < columns; c++) {
      this.grid.push({
        y1: 0, 
        y2: height,
        x1: 100 * c,
        x2: 100 * c,
      })
    }
    for (let r = 0; r < rows; r++) {
      this.grid.push({
        x1: 0, 
        x2: width,
        y1: 100 * r,
        y2: 100 * r,
      })
    }
  }

  isEditing = false;
  currentPath: Line = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  }

  clearAll() {
    this.lines = [];
  }

  down(event: MouseEvent) {
    this.isEditing = true;
    const { x, y } = this.getRelativeXY(event.x, event.y);
    this.currentPath = {
      x1: x,
      y1: y,
      x2: x,
      y2: y
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isEditing) return;
    const { x, y } = this.getRelativeXY(event.x, event.y);
    this.currentPath.x2 = x;
    this.currentPath.y2 = y;
  }

  onMouseUp(event: MouseEvent) {
    this.isEditing = false;
    const { x, y } = this.getRelativeXY(event.x, event.y);
    this.currentPath.x2 = x;
    this.currentPath.y2 = y;

    this.lines.push({
      x1: this.currentPath.x1,
      x2: this.currentPath.x2,
      y1: this.currentPath.y1,
      y2: this.currentPath.y2
    })
  }
}
