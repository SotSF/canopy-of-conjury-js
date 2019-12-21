
export interface PopoverProps {
  anchorEl: HTMLElement
  onClose: () => void
}

declare const Popover: React.SFC<PopoverProps>;
export default Popover;