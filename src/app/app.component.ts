import { Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  currentDraggingPath$ = new BehaviorSubject<number>(null);

  columnWidth: number;
  rowHeight: number;

  ngOnInit() {
    // setInterval(() => {
    //   this.viewBox = "0 0 0 0";
    // }, 3000)
    window.addEventListener("resize", () => {
      this.initGrid();
    })
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

  onPathItemClick(event: MouseEvent, pathIndex: number) {
    this.currentPath = null;
    this.currentDraggingPath$.next(pathIndex);
  }

  onKeyDown(event: KeyboardEvent) {
    console.log('del')
    if (event.key === 'Delete') {
      console.log(this.currentDraggingPath$.getValue())
      if (this.currentDraggingPath$.getValue() !== null) {
        const linesCopy = [...this.lines];
        linesCopy.splice(this.currentDraggingPath$.getValue(), 1);
        this.lines = linesCopy;
        this.currentDraggingPath$.next(null)
      }
    }
  }

  initGrid() {
    this.grid = [];
    const columnsNumber = 15;
    const rowsNumber = 15;
    const { width, height } = this.containerRef.nativeElement.getBoundingClientRect();
    this.columnWidth = width / columnsNumber;
    this.rowHeight = height / rowsNumber;
    for (let c = 0; c < columnsNumber; c++) {
      console.log(0, height, c * this.columnWidth, (c+1)*this.columnWidth)
      this.grid.push({
        y1: 0, 
        y2: height,
        x1: c * this.columnWidth,
        x2: c * this.columnWidth,
      })
    }
    for (let r = 0; r < rowsNumber; r++) {
      this.grid.push({
        x1: 0, 
        x2: width,
        y1: this.rowHeight * r,
        y2: this.rowHeight * r,
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
    console.log(event.target)
    const targetId = (event.target as HTMLElement).id;
    console.log(targetId)
    if (targetId) {
      this.currentDraggingPath$.next(+targetId);
      console.log("qui")
    } else {
      this.isEditing = true;
      const { x, y } = this.getRelativeXY(event.x, event.y);
      this.currentPath = {
        x1: x,
        y1: y,
        x2: x,
        y2: y
      }
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isEditing) return;
    const { x, y } = this.getRelativeXY(event.x, event.y);
    this.currentPath.x2 = x;
    this.currentPath.y2 = y;
  }

  getNearestGridPoint(x: number, y: number) {
    const realX = (Math.round(x / this.columnWidth)) * this.columnWidth;
    const realY = (Math.round(y / this.rowHeight)) * this.rowHeight;
    return { realX, realY }
  }

  onMouseUp(event: MouseEvent) {
    this.isEditing = false;
    const { x, y } = this.getRelativeXY(event.x, event.y);
    const { realX: realX2, realY: realY2 } = this.getNearestGridPoint(x, y);
    const { realX: realX1, realY: realY1 } = this.getNearestGridPoint(this.currentPath.x1, this.currentPath.y1);

    this.currentPath.x1 = realX1
    this.currentPath.x2 = realX2
    this.currentPath.y1 = realY1;
    this.currentPath.y2 = realY2;

    this.lines.push({
      x1: this.currentPath.x1,
      x2: this.currentPath.x2,
      y1: this.currentPath.y1,
      y2: this.currentPath.y2
    })
  }
}
