import { flags } from "../utils/Flags";

type Props = {
  team?: string;
  align?: "left" | "right";
};

const FLAG_SIZE = 120;
const FONT_SIZE = 40;
const GAP_SIZE = 12;

export function TeamFlag({ team, align = "left" }: Props) {
  if (!team) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: align === "left" ? "flex-start" : "flex-end",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#9ca3af",
            fontWeight: 600,
            fontSize: `${FONT_SIZE}px`,
          }}
        >
          -
        </span>
      </div>
    );
  }

  const src = flags[team];
  const label = team.replaceAll("-", " ");

  const imageElement = src ? (
    <img
      src={src}
      alt={team}
      style={{
        width: `${FLAG_SIZE}px`,
        height: `${FLAG_SIZE}px`,
        objectFit: "contain",
        flexShrink: 0,
      }}
    />
  ) : (
    <div
      style={{
        width: `${FLAG_SIZE}px`,
        height: `${FLAG_SIZE}px`,
        borderRadius: "999px",
        backgroundColor: "#374151",
        flexShrink: 0,
      }}
    />
  );

  const textElement = (
    <span
      style={{
        color: "#fff",
        fontWeight: 600,
        fontSize: `${FONT_SIZE}px`,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textTransform: "capitalize",
      }}
    >
      {label}
    </span>
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: align === "left" ? "flex-start" : "flex-end",
        alignItems: "center",
        gap: `${GAP_SIZE}px`,
        minWidth: 0,
      }}
    >
      {align === "left" ? (
        <>
          {imageElement}
          {textElement}
        </>
      ) : (
        <>
          {textElement}
          {imageElement}
        </>
      )}
    </div>
  );
}