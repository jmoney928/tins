/**
 * Re-mounted on every navigation, which is what makes it the place for the
 * page fade: the hero's "See the tin" lands on the product page with a soft
 * cut rather than a hard swap. Opacity only — a transform here would become
 * the containing block for the fixed nav and the sticky buy bar.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
