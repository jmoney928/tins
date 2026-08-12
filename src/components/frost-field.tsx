/**
 * Ambient background for the light build: pale ice washes drifting over
 * white, plus a survey grid and a very light grain plate. Pure CSS, no
 * state, safe to render on the server.
 */
export function FrostField() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-paper" />
        <div className="animate-drift absolute -top-[30vh] -left-[16vw] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(143,210,232,0.45),transparent_66%)] blur-3xl" />
        <div className="animate-drift-reverse absolute top-[36vh] -right-[20vw] h-[72vh] w-[72vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(46,157,200,0.22),transparent_68%)] blur-3xl" />
        <div className="animate-drift absolute bottom-[-26vh] left-[24vw] h-[62vh] w-[62vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(228,243,249,0.9),transparent_70%)] blur-3xl" />

        {/* survey grid, fades out downward */}
        <div
          className="absolute inset-0 opacity-[0.5] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,45,70,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(16,45,70,0.055) 1px, transparent 1px)",
            backgroundSize: "88px 88px",
          }}
        />
      </div>
      <div className="grain-layer pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-multiply" />
    </>
  );
}
