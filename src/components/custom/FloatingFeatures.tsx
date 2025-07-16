import { DynamicIcon } from "./DynamicIcon";

type PositionKey =
    | "top-left"
    | "top-center"
    | "top-right"
    | "middle-left"
    | "middle-right"
    | "center"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "floating-left"
    | "floating-right"

const positions: Record<PositionKey, string> = {
    "top-left": "top-5 left-5",
    "top-center": "top-10 left-[50%] -translate-x-1/2",
    "top-right": "top-5 right-5",
    "middle-left": "top-[35%] left-[5%]",
    "middle-right": "top-[35%] right-[5%]",
    "center": "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    "bottom-left": "bottom-10 left-[10%]",
    "bottom-center": "bottom-10 left-[50%] -translate-x-1/2",
    "bottom-right": "bottom-[10%] right-[10%]",
    "floating-left": "bottom-[40%] left-[3%]",
    "floating-right": "top-[60%] right-[10%]",
};

function getPositionClasses(key: string): string {
    return positions[key as PositionKey] || positions.center;
}

const FloatingFeature = ({ icon, label, position, delay }: {
    icon: string | undefined,
    label: string,
    position: string,
    delay: string
}) => (
    <div
        className={`absolute ${getPositionClasses(position)} bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1 shadow-lg w-auto animate-float z-20`}
        style={{ animationDelay: delay }}
    >
        <div className="flex items-center gap-2">
            <DynamicIcon iconName={icon || ""} className="w-5 h-5 text-secondary" />
            <span className="text-white text-sm">{label}</span>
        </div>
    </div>
);

export default FloatingFeature