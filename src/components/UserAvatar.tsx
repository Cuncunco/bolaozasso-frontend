type UserAvatarProps = {
  avatarUrl?: string | null;
  size?: number;
  name?: string | null;
};

export function UserAvatar({
  avatarUrl,
  size = 42,
  name,
}: UserAvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "999px",
        overflow: "hidden",
        backgroundColor: "#173b2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgba(247, 221, 67, 0.5)",
        flexShrink: 0,
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name || "Usuário"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <span style={{ fontSize: size / 2.2 }}>👤</span>
      )}
    </div>
  );
}