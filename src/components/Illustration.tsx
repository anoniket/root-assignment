// Native asset is 601×384 — pin the aspect ratio so layout doesn't depend on
// the PNG decoding before we know its intrinsic dimensions.
export function Illustration({ className }: { className?: string }) {
  return (
    <img
      src="/illustration.png"
      alt="Illustration of a person creating an account on their phone"
      width={600}
      height={384}
      className={className}
      draggable={false}
    />
  );
}
