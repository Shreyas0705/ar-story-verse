/**
 * Custom A-Frame components for in-world AR quiz and controls.
 * Call registerAframeComponents() after AFRAME is loaded.
 */

export function registerAframeComponents() {
  const AFRAME = (window as any).AFRAME;
  if (!AFRAME) return;

  // ── Dwell-select: gaze/cursor hover for N ms triggers click ──
  if (!AFRAME.components["dwell-select"]) {
    AFRAME.registerComponent("dwell-select", {
      schema: { duration: { type: "number", default: 1500 } },
      init() {
        this.timer = 0;
        this.hovering = false;
        this.ring = null;

        // Create progress ring entity
        this.ring = document.createElement("a-ring");
        this.ring.setAttribute("radius-inner", 0.04);
        this.ring.setAttribute("radius-outer", 0.06);
        this.ring.setAttribute("color", "#a855f7");
        this.ring.setAttribute("theta-length", 0);
        this.ring.setAttribute("position", "0 -0.18 0.01");
        this.ring.setAttribute("visible", false);
        this.el.appendChild(this.ring);

        this.el.addEventListener("mouseenter", () => {
          this.hovering = true;
          this.timer = 0;
          if (this.ring) this.ring.setAttribute("visible", true);
          this.el.setAttribute("material", "opacity", 0.85);
        });

        this.el.addEventListener("mouseleave", () => {
          this.hovering = false;
          this.timer = 0;
          if (this.ring) {
            this.ring.setAttribute("theta-length", 0);
            this.ring.setAttribute("visible", false);
          }
          this.el.setAttribute("material", "opacity", 0.6);
        });
      },
      tick(_time: number, delta: number) {
        if (!this.hovering) return;
        this.timer += delta;
        const progress = Math.min(this.timer / this.data.duration, 1);
        if (this.ring) {
          this.ring.setAttribute("theta-length", progress * 360);
        }
        if (progress >= 1) {
          this.hovering = false;
          this.timer = 0;
          if (this.ring) {
            this.ring.setAttribute("theta-length", 0);
            this.ring.setAttribute("visible", false);
          }
          this.el.emit("dwell-activated");
          this.el.setAttribute("material", "opacity", 0.6);
        }
      },
    });
  }

  // ── Billboard: always face camera ──
  if (!AFRAME.components["billboard"]) {
    AFRAME.registerComponent("billboard", {
      tick() {
        const camera = this.el.sceneEl?.camera;
        if (!camera) return;
        const camPos = new (window as any).THREE.Vector3();
        camera.getWorldPosition(camPos);
        this.el.object3D.lookAt(camPos);
      },
    });
  }

  // ── Fade-in animation on spawn ──
  if (!AFRAME.components["fade-in"]) {
    AFRAME.registerComponent("fade-in", {
      schema: { dur: { type: "number", default: 600 } },
      init() {
        this.el.setAttribute("material", "opacity", 0);
        this.elapsed = 0;
      },
      tick(_t: number, dt: number) {
        if (this.elapsed >= this.data.dur) return;
        this.elapsed += dt;
        const opacity = Math.min(this.elapsed / this.data.dur, 1) * 0.7;
        this.el.setAttribute("material", "opacity", opacity);
      },
    });
  }
}
