import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import * as coreui from "@coreui/coreui-pro"

type SortOrder = "asc" | "desc";

export interface TableSorterObject {
  name: string,
  order: SortOrder
}

@Directive({
  selector: '[tableSorter]'
})
export class TableSorter {
  private popover: coreui.Popover;

  @Output()
  public onSortingChanged: EventEmitter<TableSorterObject> = new EventEmitter<TableSorterObject>();

  public static TEMPLATE: string = '<div><button type="button" data-order="asc" class="btn btn-light mr-1"><span class="cis-arrow-top btn-icon"></span></button><button type="button" data-order="desc" class="btn btn-light"><span class="cis-arrow-bottom btn-icon"></span></button></div>';
  public static PARAM_NAME: string = "name=";
  public static PARAM_ORDER: string = "&order=";

  constructor(
    private htmlElement: ElementRef) {
    this._checkNativeElement();
    this._setPopoverData();
    this._setLinkData();

  }

  private _setPopoverData() {
    this.htmlElement.nativeElement.setAttribute("data-container", "body");
    this.htmlElement.nativeElement.setAttribute("data-toggle", "popover");
    this.htmlElement.nativeElement.setAttribute("data-placement", "bottom");
    this.htmlElement.nativeElement.setAttribute("data-content", TableSorter.TEMPLATE);
    this.htmlElement.nativeElement.setAttribute("data-trigger", "trigger");
    this.htmlElement.nativeElement.setAttribute("data-html", "true");

    this.popover = new coreui.Popover(this.htmlElement.nativeElement, {
      sanitize: false,
    });
  }

  private _checkNativeElement() {
    if (this.htmlElement.nativeElement.tagName !== "A") {
      throw new TypeError("Element where tableSorter-Directive is used must be an 'a'-HTML-Element.");
    }

    if (!this.htmlElement.nativeElement.dataset.property) {
      throw new ReferenceError("Custom HTML-Attribute 'data-property' must be given.");
    }

    if (this.htmlElement.nativeElement.tabIndex === undefined || this.htmlElement.nativeElement.tabIndex === "") {
      throw new ReferenceError("HTML-Attribute 'tabindex' with an unique number must be given.");
    }
  }

  private _setLinkData() {
    this.htmlElement.nativeElement.style.cursor = "pointer";
  }

  @HostListener("click")
  onAscendingClick() {
    (<any>$(this.popover.getTipElement())).find("button").click(function (oEvent) {
      let sOrder: SortOrder = oEvent.currentTarget.dataset.order,
        sName: string = this.htmlElement.nativeElement.dataset.property;
      this.onSortingChanged.emit({
        name: sName,
        order: sOrder
      });
    }.bind(this));
  }

}