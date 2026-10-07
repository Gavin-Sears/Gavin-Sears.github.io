// Portfolio content. Add an entry here and drop its thumbnail in public/media/<id>.webp.
// Order doesn't matter: the list sorts newest first.

import type { Entry } from './types';

export const entries: Entry[] = [
  // ---------- Penn (MSE, Computer Graphics & Game Technology) ----------
  {
    id: 'path-tracer',
    kind: 'school',
    title: 'GPU Path Tracer',
    context: 'Penn CIS 5650 · GPU Programming',
    date: '2026-09',
    end: '2026-10',
    description:
      'A physically based GPU path tracer in C++/CUDA with multiple importance sampling and next event estimation, GGX microfacet and refractive materials, HDRI lighting, thin-lens depth of field, and texture/bump mapping for glTF. A median-split BVH cut render time on a 70k-triangle mesh by 960×, with heatmap and leaf-node debug views to profile traversal cost. Stream compaction (thrust) and material sorting (CUB radix sort) gave up to 1.9× speedup in open scenes, and Intel Open Image Denoise runs on the GPU with albedo and normal buffers for interactive denoised previews.',
    thumbnail: '/media/path-tracer.webp',
    thumbAlt: 'Path-traced render of water splashing beside a pufferfish hot-air balloon',
    link: 'https://github.com/Gavin-Sears/Project3-CUDA-Path-Tracer',
    keywords: ['C++', 'CUDA', 'OpenGL', 'Path Tracing'],
    hiddenKeywords: ['ray tracing', 'raytracing', 'GPU', 'BVH', 'denoising', 'OIDN', 'PBR', 'glTF', 'thrust', 'CUB', 'rendering'],
  },
  {
    id: 'gaussian-fluids',
    kind: 'school',
    title: 'Gaussian Fluids',
    context: 'Penn · Advanced Topics in Computer Graphics',
    date: '2026-05',
    description:
      'An implementation of the Gaussian Fluids research paper as a Houdini plugin. The velocity field is represented as Gaussians, simulating fluid motion that preserves more vorticity and uses less memory than typical grid-based solvers.',
    thumbnail: '/media/gaussian-fluids.webp',
    thumbAlt: 'Stanford bunny in Houdini with purple Gaussian vortex rings',
    link: 'https://github.com/Gavin-Sears/Gushin-Gaussians',
    keywords: ['C++', 'C', 'Houdini', 'Simulation'],
    hiddenKeywords: ['fluid simulation', 'physics', 'research paper', 'HDK', 'plugin', 'vorticity'],
  },
  {
    id: 'virtual-aquarium',
    kind: 'school',
    title: 'Virtual Aquarium',
    context: 'Penn CIS 5660 · Procedural Computer Graphics',
    date: '2025-09',
    end: '2025-12',
    description:
      'A procedural WebGL2 renderer with a fish generator that extrudes parameterized ring loops along a body spine, with 20+ real-time parameters and per-frame pivot-based transforms.',
    thumbnail: '/media/virtual-aquarium.webp',
    thumbAlt: 'Procedural fish swimming among colorful seaweed in the virtual aquarium',
    link: 'https://virtual-aquarium-5660.vercel.app',
    keywords: ['WebGL2', 'TypeScript', 'Procedural'],
    hiddenKeywords: ['procedural generation', 'GLSL', 'shaders', 'web', 'real-time', 'fish'],
  },

  // ---------- Earlier projects (from the old site) ----------
  // Dates are the last relevant update.
  {
    id: 'high-score',
    kind: 'school',
    title: 'High Score',
    context: 'VCAM installation · Haverford College',
    date: '2024-12',
    description:
      'An iPad game installed at the VCAM, which ran continuously (including overnight) from 12/11/24 to 12/19/24 without performance or memory issues. It features 6 textured, game-optimized 3D models, 3 animations for the main character, 3 shaders (shell-texture grass, flowing water, sprite animation) in GLSL and Metal, an original soundtrack made in FL Studio, an autosave system for game state and the leaderboard, and basic LOD with looping levels.',
    thumbnail: '/media/high-score.webp',
    thumbAlt: 'Red cart driving across a grassy level in High Score',
    link: 'https://www.instagram.com/p/DDXg7ZnJIdU/',
    keywords: ['Swift', 'Metal', 'GLSL', 'Blender'],
    hiddenKeywords: ['iOS', 'iPad', 'Xcode', 'FL Studio', 'GIMP', 'shaders', 'game', 'shell texturing', 'LOD', 'music'],
  },
  {
    id: 'game-programming-demos',
    kind: 'school',
    title: 'Game Programming Demos',
    context: 'CS 283 · Game Programming',
    date: '2024-12',
    description: 'Game programming demos in C# and Unity, including a 3D platformer, particle systems, enemy AI, and material swapping system that makes objects transparent when in front of the player.',
    thumbnail: '/media/game-programming-demos.webp',
    thumbAlt: 'Marble bust struck by a volley of arrows in a Unity scene',
    link: 'https://github.com/Gavin-Sears/cs283-f24-assignments',
    keywords: ['C#', 'Unity', 'Blender'],
    hiddenKeywords: ['game', 'game programming', 'csharp'],
  },
  {
    id: 'model-editor',
    kind: 'school',
    title: '3D Model Editor',
    date: '2023-05',
    description:
      'An easy-to-use 3D model creator: build something out of cubes, then decorate it with 3D models whose color, size, and rotation can be changed.',
    thumbnail: '/media/model-editor.webp',
    thumbAlt: 'Flexing cube-built monster with red horns and a green eye, made in the model editor',
    link: 'https://github.com/Gavin-Sears/popit-decorations/tree/main',
    keywords: ['C++', 'OpenGL', 'GLSL', 'Blender'],
    hiddenKeywords: ['tools', 'editor', 'voxel', 'shaders'],
  },
  {
    id: 'particle-effects',
    kind: 'school',
    title: 'Particle Effects',
    date: '2023-04',
    description: 'Particle effects built in C++ and OpenGL.',
    thumbnail: '/media/particle-effects.webp',
    thumbAlt: 'Dazed character with yellow chick particles circling its head',
    link: 'https://github.com/Gavin-Sears/popit-decorations/tree/main',
    keywords: ['C++', 'OpenGL', 'Blender'],
    hiddenKeywords: ['particles', 'VFX', 'effects'],
  },
  {
    id: 'vertex-animation',
    kind: 'personal',
    title: 'Vertex Animation Shaders & GPU Instancing',
    date: '2023-08',
    description:
      'Two Blender animations (an egg creature running, and a physics-simulated book page turning) baked into textures, played back by two custom Unity URP Shader Graph shaders: one animates a mesh from a texture and an extra UV set, the other scrubs through vertex-animation frames from scripts. Many meshes can animate at once while still using GPU instancing to reduce draw calls, and baked physics animations come into Unity with little effort. Some features of the game were removed for this demo.',
    thumbnail: '/media/vertex-animation.webp',
    thumbAlt: 'Crowd of instanced egg creatures in a Unity scene',
    keywords: ['C#', 'Unity', 'Shader Graph', 'Python', 'Blender', 'UI/UX Design'],
    hiddenKeywords: ['VAT', 'vertex animation textures', 'instancing', 'URP', 'shaders', 'csharp', 'optimization'],
  },
  {
    id: 'ui-design-case-study',
    kind: 'school',
    title: 'UI Design Case Study',
    // TODO(user): description.
    date: '2024-12',
    description: 'A UI design case study made in Figma.',
    thumbnail: '/media/ui-design-case-study.webp',
    thumbAlt: 'Grid of mobile app screens from the Figma case study',
    link: 'https://www.figma.com/design/8yJfaDqdGnJPYAPANhWVV8/Gavin---Design?node-id=145-59871',
    keywords: ['Figma', 'UI/UX Design'],
    hiddenKeywords: ['design', 'prototype', 'user interface'],
  },
  {
    id: 'word-wizard',
    kind: 'personal',
    title: 'Word Wizard',
    context: 'Lemon Dragon Studio · Co-founder',
    date: '2023-07',
    description:
      'An educational ESL game that teaches conversational and writing skills through gamified drills, by Lemon Dragon Studio, which I co-founded. I created the 3D models, oversaw most of the UI design, and wrote a large share of the software, including the UI and the code for one of the three minigames. Currently unreleased; we plan to finish optimizing the UI and some scenes and publish it on itch.io.',
    thumbnail: '/media/word-wizard.webp',
    thumbAlt: 'Mushroom wizard character model from Word Wizard',
    link: 'https://www.instagram.com/p/CzWk3BmMhsi/',
    keywords: ['C#', 'Unity', 'Blender', 'UI/UX Design'],
    hiddenKeywords: ['game', 'education', 'ESL', 'Shader Graph', 'GIMP', 'startup', 'csharp', '3D modeling'],
  },
];
