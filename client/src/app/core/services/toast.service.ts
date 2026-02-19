import { Injectable, inject, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ToastComponent, ToastType } from '../../shared/components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private currentToastRef: ComponentRef<ToastComponent> | null = null;
  private timeoutId: any;

  show(message: string, type: ToastType = 'info', duration = 3000) {
    if (this.overlayRef?.hasAttached()) {
      this.forceClear();
    }

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay.position().global().bottom('20px').centerHorizontally(),
        hasBackdrop: false,
        panelClass: 'pointer-events-none',
      });
    }

    const portal = new ComponentPortal(ToastComponent);
    this.currentToastRef = this.overlayRef.attach(portal);
    const instance = this.currentToastRef.instance;

    instance.message = message;
    instance.type = type;

    instance.close = () => this.forceClear();

    this.timeoutId = setTimeout(() => {
      if (this.currentToastRef) {
        this.currentToastRef.instance.triggerClose();
      }
    }, duration);
  }

  success(message: string) {
    this.show(message, 'success');
  }
  error(message: string) {
    this.show(message, 'error');
  }
  info(message: string) {
    this.show(message, 'info');
  }

  private forceClear() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
