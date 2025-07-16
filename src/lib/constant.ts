export const POSITION_OPTIONS = [
  {
    value: "top-left",
    label: "Top Left",
    className: "top-5 left-5"
  },
  {
    value: "top-center",
    label: "Top Center",
    className: "top-10 left-[50%] -translate-x-1/2"
  },
  {
    value: "top-right",
    label: "Top Right", 
    className: "top-5 right-5"
  },
  {
    value: "middle-left",
    label: "Middle Left",
    className: "top-[35%] left-[5%]"
  },
  {
    value: "middle-right",
    label: "Middle Right",
    className: "top-[35%] right-[5%]"
  },
  {
    value: "center",
    label: "Center",
    className: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  },
  {
    value: "bottom-left",
    label: "Bottom Left",
    className: "bottom-10 left-[10%]"
  },
  {
    value: "bottom-center",
    label: "Bottom Center",
    className: "bottom-10 left-[50%] -translate-x-1/2"
  },
  {
    value: "bottom-right",
    label: "Bottom Right",
    className: "bottom-[10%] right-[10%]"
  },
  {
    value: "floating-left",
    label: "Floating Left",
    className: "bottom-[40%] left-[3%]"
  },
  {
    value: "floating-right",
    label: "Floating Right",
    className: "top-[60%] right-[10%]"
  }
] as const;