type AvatarProps = {
  url: string | null;
  initials: string;
  size?: "md" | "lg";
};

// foto si hay, y si no las iniciales sobre un circulo del color primario
export function Avatar({ url, initials, size = "lg" }: AvatarProps) {
  if (url) {
    return <img className={`profile avatar ${size}`} src={url} alt="" />;
  }

  return (
    <div className={`profile avatar placeholder ${size}`} aria-hidden="true">
      {initials}
    </div>
  );
}
