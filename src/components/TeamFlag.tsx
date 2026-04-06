import { getFlagSrc } from "../utils/Flags";

type Props = {
  team?: string;
  align?: "left" | "right";
};

export function TeamFlag({ team, align = "left" }: Props) {
  const isMobile = window.innerWidth <= 640;
  const isSmallMobile = window.innerWidth <= 420;

  const FLAG_SIZE = isSmallMobile ? 52 : isMobile ? 68 : 120;
  const FONT_SIZE = isSmallMobile ? 16 : isMobile ? 22 : 40;
  const GAP_SIZE = isSmallMobile ? 8 : 12;

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

  const src = getFlagSrc(team);
  const label = team.replaceAll("-", " ");

  const imageElement = (
    <img
      src={src}
      alt={team}
      loading="lazy"
      onError={(e) => {
        // Fallback (prevents broken image icon from "killing" the UI).
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
      style={{
        width: `${FLAG_SIZE}px`,
        height: `${FLAG_SIZE}px`,
        objectFit: "contain",
        flexShrink: 0,
        filter: "none",
        opacity: 1,
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
        minWidth: 0,
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