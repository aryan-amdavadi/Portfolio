import WebGLCanvas from '@/canvas/WebGLCanvas';

export default function Home() {
  return (
    <>
      <WebGLCanvas />
      <main className="layer-ui container">
        <section className="heading-hero" style={{ paddingTop: '20vh' }}>
          01 THE BUILDER
        </section>
        <p className="text-editorial" style={{ marginTop: '2rem', maxWidth: '600px' }}>
          I am a developer who solves real-world problems.
        </p>
      </main>
    </>
  );
}
