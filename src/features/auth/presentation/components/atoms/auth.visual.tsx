export function AuthVisual() {
  return (
    <picture className="auth visual" aria-hidden="true">
      <source
        media="(max-width: 767px), (max-aspect-ratio: 4 / 5)"
        srcSet="/imgs/auth/mobile.webp"
      />
      <img
        src="/imgs/auth/desktop.webp"
        srcSet="/imgs/auth/desktop.webp 1x, /imgs/auth/desktop4k.webp 2x"
        alt=""
      />
    </picture>
  );
}
