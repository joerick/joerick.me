import Vector from './Vector';

interface GestureRecognizerDelegate {
  tap?: (position: Vector)=>void;
  hover?: (position: Vector)=>void;
  hoverEnd?: ()=>void;
  dragStart?: (initialPosition: Vector)=>void;
  drag?: (initialPosition: Vector, delta: Vector, totalDelta: Vector)=>void;
  dragEnd?: ()=>void;
  panzoom?: (panDelta: Vector, zoomDelta: number)=>void;
  hold?: (position: Vector)=>void;
  holdMove?: (initialPosition: Vector, delta: Vector, totalDelta: Vector)=>void; // called for motion after the hold event fired
  holdEnd?: ()=>void;

  // these methods are separate from the gesture recognisers, they are called
  // regardless of how the gesture is recognised.
  pointerDown?: (position: Vector, pointer: Pointer)=>void;
  pointerMove?: (initialPosition: Vector, delta: Vector, totalDelta: Vector, pointer: Pointer)=>void;
  pointerUp?: (pointer: Pointer)=>void;
}

interface Pointer {
  downTime: number;
  upTime?: number,
  position: Vector,
  downPosition: Vector,
  prevPosition: Vector,
  type?: 'tap'|'drag'|'hold'|'panzoom';
  holdTimer?: any,
}

export default class GestureRecognizer {
  // TODO: these might be stale by the time they're used. Consider generating them with getters.
  elementSize: Vector;
  elementCenter: Vector;

  constructor(readonly element: HTMLElement, public delegate: GestureRecognizerDelegate) {
    this.mousedown = this.mousedown.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.touchmove = this.touchmove.bind(this);
    this.touchstart = this.touchstart.bind(this);
    this.touchend = this.touchend.bind(this);
    this.touchcancel = this.touchcancel.bind(this);
    this.elementMousemove = this.elementMousemove.bind(this);
    this.elementMouseleave = this.elementMouseleave.bind(this);
    this.windowClick = this.windowClick.bind(this)

    this.element.addEventListener('mousedown', this.mousedown);
    this.element.addEventListener('mousemove', this.elementMousemove);
    this.element.addEventListener('mouseleave', this.elementMouseleave);
    this.element.addEventListener('touchstart', this.touchstart);
    this.element.addEventListener('touchmove', this.touchmove);
    this.element.addEventListener('touchend', this.touchend);
    this.element.addEventListener('touchcancel', this.touchcancel);
    window.addEventListener('click', this.windowClick, {capture: true})

    const {top, left, width, height} = this.element.getBoundingClientRect();
    this.elementSize = {x: width, y: height};
    this.elementCenter = {x: left+width/2, y: top+height/2};
  }

  stop() {
    this.element.removeEventListener('mousedown', this.mousedown);
    this.element.removeEventListener('mousemove', this.elementMousemove);
    this.element.removeEventListener('mouseleave', this.elementMouseleave);
    this.element.removeEventListener('mousemove', this.mousemove);
    this.element.removeEventListener('mouseup', this.mouseup);
    this.element.removeEventListener('touchstart', this.touchstart);
    this.element.removeEventListener('touchmove', this.touchmove);
    this.element.removeEventListener('touchend', this.touchend);
    this.element.removeEventListener('touchcancel', this.touchcancel);
    window.removeEventListener('click', this.windowClick, {capture: true})
  }

  ////////////////////
  // mouse handling //
  ////////////////////

  mouseMode: 'normal'|'pan'|'zoom' = 'normal';
  mousedown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation()
    const position = {x: event.pageX, y: event.pageY};

    this.delegate.hoverEnd?.();

    if (event.shiftKey) {
      this.mouseMode = 'pan';
    } else if (event.altKey) {
      this.mouseMode = 'zoom';
    } else {
      this.mouseMode = 'normal';
    }

    if (this.mouseMode == 'normal') {
      const pointer = {
        position,
        downPosition: position,
        prevPosition: position,
        downTime: Date.now(),
      };
      this.pointers.set('mouse', pointer);
      this.pointerDown(pointer);
    } else {
      let p1, p2;
      if (this.mouseMode == 'pan') {
        [p1, p2] = this.mousePanPositions(position);
      } else if (this.mouseMode == 'zoom') {
        [p1, p2] = this.mouseZoomPositions(position);
      } else {
        throw 'unknown mouse mode'
      }

      this.pointers.set('mouse1', {
        position: p1,
        downPosition: p1,
        prevPosition: p1,
        downTime: Date.now(),
      });
      this.pointers.set('mouse2', {
        position: p2,
        downPosition: p2,
        prevPosition: p2,
        downTime: Date.now(),
      });
    }

    window.addEventListener('mousemove', this.mousemove);
    window.addEventListener('mouseup', this.mouseup);
  }
  elementMousemove(event: MouseEvent) {
    // called even when mouse isn't down
    const position = {x: event.pageX, y: event.pageY};
    const pointer = this.pointers.get('mouse');
    if (!pointer) {
      this.delegate.hover?.(position);
    };
  }
  elementMouseleave(event: MouseEvent) {
    const pointer = this.pointers.get('mouse');
    if (!pointer) {
      this.delegate.hoverEnd?.();
    };
  }
  mousemove(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation()
    const position = {x: event.pageX, y: event.pageY};

    if (this.mouseMode == 'normal') {
      const pointer = this.pointers.get('mouse');
      if (!pointer) {
        this.delegate.hover?.(position);
        return
      };

      pointer.prevPosition = pointer.position;
      pointer.position = position;
      this.pointerMove(pointer);
    } else {
      let p1, p2;
      if (this.mouseMode == 'pan') {
        [p1, p2] = this.mousePanPositions(position);
      } else if (this.mouseMode == 'zoom') {
        [p1, p2] = this.mouseZoomPositions(position);
      } else {
        throw 'unknown mouse mode'
      }

      const pointer1 = this.pointers.get('mouse1')!;
      pointer1.prevPosition = pointer1.position;
      pointer1.position = p1;
      this.pointerMove(pointer1);

      const pointer2 = this.pointers.get('mouse2')!;
      pointer2.prevPosition = pointer2.position;
      pointer2.position = p2;
      this.pointerMove(pointer2);
    }
  }
  _lastMouseUpTimestamp: number = 0
  mouseup(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation()
    this._lastMouseUpTimestamp = event.timeStamp
    window.removeEventListener('mousemove', this.mousemove);
    window.removeEventListener('mouseup', this.mouseup);

    if (this.mouseMode == 'normal') {
      const pointer = this.pointers.get('mouse');
      if (!pointer) { return };

      this.oldPointers.push(pointer);
      this.pointers.delete('mouse');
      this.pointerUp(pointer);
    } else {
      const pointer1 = this.pointers.get('mouse1')!;
      this.oldPointers.push(pointer1);
      this.pointers.delete('mouse1');
      this.pointerUp(pointer1);
      const pointer2 = this.pointers.get('mouse2')!;
      this.oldPointers.push(pointer2);
      this.pointers.delete('mouse2');
      this.pointerUp(pointer2);

      this.mouseMode = 'normal';
    }

    const position = {x: event.pageX, y: event.pageY};
    this.delegate.hover?.(position);
  }

  windowClick(event: MouseEvent) {
    if (event.timeStamp == this._lastMouseUpTimestamp) {
        // this click should be prevented, because it was handled by the mouseup
        // if you need a click event, use the 'tap' from this gesture recognizer
        // console.log('click swallowed by gesture recognizer')
        event.preventDefault()
        event.stopPropagation()
    }
  }

  ////////////////////
  // touch handling //
  ////////////////////

  touchstart(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation()
    this.handleTouch(event);
  }
  touchmove(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation()
    this.handleTouch(event);
  }
  touchend(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation()
    this.handleTouch(event);
  }
  touchcancel(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation()
    this.handleTouch(event);
  }

  handleTouch(event: TouchEvent) {
    // added
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      const identifier = touch.identifier;

      if (!this.pointers.has(identifier)) {
        const position = {x: touch.pageX, y: touch.pageY};
        const pointer = {
          position,
          downPosition: position,
          prevPosition: position,
          downTime: Date.now(),
          couldBeATap: true,
        }
        this.pointers.set(identifier, pointer);
        this.pointerDown(pointer);
      }
    }

    // modified
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      const identifier = touch.identifier;
      const pointer = this.pointers.get(identifier)!
      const position = {x: touch.pageX, y: touch.pageY};

      if (Vector.magnitude(Vector.sub(position, pointer.position)) > 0) {
        pointer.prevPosition = pointer.position;
        pointer.position = position;
        this.pointerMove(pointer);
      }
    }

    // removed
    for (const pointerId of Array.from(this.pointers.keys())) {
      const pointer = this.pointers.get(pointerId)!
      let found = false;
      for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        if (touch.identifier == pointerId) {
          found = true;
        }
      }
      if (!found) {
        this.oldPointers.push(pointer);
        this.pointers.delete(pointerId);
        this.pointerUp(pointer);
      }
    }
  }

  //////////////////////////////
  // generic pointer handling //
  //////////////////////////////

  pointers: Map<string|number, Pointer> = new Map();
  oldPointers: Pointer[] = []
  previousMousePosition: Vector|null = null;
  holdDuration = 500;
  dragThreshold = 15;
  get numPointers() { return this.pointers.size }

  pointerDown(pointer: Pointer) {
    this.delegate.pointerDown?.(pointer.position, pointer);

    pointer.holdTimer = window.setTimeout(() => {
      if (pointer.upTime) return;

      pointer.type = 'hold';
      this.delegate.hold?.(pointer.position);
    }, this.holdDuration);
  }
  pointerMove(pointer: Pointer) {
    const delta = Vector.sub(pointer.position, pointer.prevPosition);
    const totalOffset = Vector.sub(pointer.position, pointer.downPosition);
    this.delegate.pointerMove?.(pointer.downPosition, delta, totalOffset, pointer);

    if (Vector.magnitude(totalOffset) > this.dragThreshold) {
      if (pointer.type === undefined && this.numPointers) {
        pointer.type = 'drag';
        this.delegate.dragStart?.(pointer.downPosition);
      }
      if (pointer.holdTimer) {
        clearTimeout(pointer.holdTimer);
        pointer.holdTimer = null;
      }
    }

    if (this.numPointers == 1) {
      if (pointer.type == 'drag') {
        this.delegate.drag?.(pointer.downPosition, delta, totalOffset)
      }
      if (pointer.type == 'hold') {
        this.delegate.holdMove?.(pointer.downPosition, delta, totalOffset);
      }
    } else {
      // more than one
      const allPointers = Array.from(this.pointers.values());
      const otherPointers = Array.from(this.pointers.values()).filter(p => p !== pointer)
      pointer.type = 'panzoom';
      otherPointers.forEach(p => p.type = 'panzoom');

      const prevPoints = otherPointers.map(p => p.position).concat([pointer.prevPosition]);
      const currentPoints = allPointers.map(p => p.position)

      const prevAveragePoint = averagePoint(prevPoints);
      const currentAveragePoint = averagePoint(currentPoints);

      const prevAverageMag = mean(
        prevPoints.map(p => Vector.magnitude(Vector.sub(p, prevAveragePoint)))
      )
      const currentAverageMag = mean(
        currentPoints.map(p => Vector.magnitude(Vector.sub(p, currentAveragePoint)))
      )

      let panDelta = Vector.sub(currentAveragePoint, prevAveragePoint);
      let zoomDelta = currentAverageMag / prevAverageMag;

      // zooming about a certain point has a pan component.

      // hack because mouse simulation is buggy
      if (this.mouseMode === 'pan') {
        zoomDelta = 1;
      } else {
        const zoomOffsetFromCenter = Vector.sub(currentAveragePoint, this.elementCenter)
        panDelta = Vector.add(panDelta, Vector.mult(zoomOffsetFromCenter, 1-zoomDelta));
      }

      this.delegate.panzoom?.(panDelta, zoomDelta);
    }
  }
  pointerUp(pointer: Pointer) {
    this.delegate.pointerUp?.(pointer);

    if (pointer.type === undefined) {
      pointer.type = 'tap';
      this.delegate.tap?.(pointer.position);
    } else if (pointer.type == 'drag') {
      this.delegate.dragEnd?.();
    } else if (pointer.type == 'hold') {
      this.delegate.holdEnd?.();
    }

    clearTimeout(pointer.holdTimer);
    pointer.holdTimer = null;
  }

  private mousePanPositions(mousePosition: Vector): [Vector, Vector] {
    return [
      Vector.add(mousePosition, {x: -10, y: 0}),
      Vector.add(mousePosition, {x: 10, y: 0}),
    ]
  }

  private mouseZoomPositions(mousePosition: Vector): [Vector, Vector] {
    const offsetToCenter = Vector.sub(this.elementCenter, mousePosition);

    return [
      mousePosition,
      Vector.add(mousePosition, Vector.mult(offsetToCenter, 2)),
    ]
  }
}

function averagePoint(points: Vector[]) {
  return {
    x: mean(points.map(p=>p.x)),
    y: mean(points.map(p=>p.y)),
  }
}

function mean(numbers: number[]) {
  let sum = 0.0;
  for (const number of numbers) {
    sum += number;
  }
  return sum / numbers.length
}
