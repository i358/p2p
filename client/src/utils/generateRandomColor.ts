let color: any;
export default function generateRandomColor() {
  if (typeof color === "string") return color;
  color = Math.random().toString(16).substr(-6);
  return color;
}
