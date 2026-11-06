import * as THREE from 'three'

// Matches the reference product photography: matte black can body across
// the whole line, with a single accent color carrying the flavor identity
// (the "BLUE RASPBERRY" shots use bright blue for the logo, streaks, and
// flavor name — everything else on the can is neutral black/white/silver).
const FLAVORS = {
  berry: {
    name: "Berry",
    label: "BERRY",
    subtitle: "ACAI • BLUEBERRY • POMEGRANATE",

    body: "#111111",

    accent: "#D72E4E",

    accentDark: "#8A1E32",

    glow: "#FF5475",

    shadow: "#0A0A0A",

    highlight: "#FFE3EA"
  },

  lime: {
    name: "Lime",

    label: "LIME",

    subtitle: "LIME • CITRUS • SEA SALT",

    body: "#111111",

    accent: "#56D93E",

    accentDark: "#388E28",

    glow: "#B6FF5E",

    shadow: "#0A0A0A",

    highlight: "#E8FFD7"
  },

  mango: {
    name: "Mango",

    label: "MANGO",

    subtitle: "MANGO • CITRUS • PASSION",

    body: "#111111",

    accent: "#FF9A1F",

    accentDark: "#B86B15",

    glow: "#FFD067",

    shadow: "#0A0A0A",

    highlight: "#FFF0C5"
  },

  blue: {
    name: "Blue Raspberry",

    label: "BLUE RASPBERRY",

    subtitle: "BLUE RASPBERRY • ELECTROLYTES",

    body: "#111111",

    accent: "#2F8DFF",

    accentDark: "#1F5EB3",

    glow: "#65E8FF",

    shadow: "#0A0A0A",

    highlight: "#D9F7FF"
  }
}

function applyTexture(texture){
    texture.encoding = THREE.sRGBEncoding
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.anisotropy = 16
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true
    return texture
}

// ── Small icon glyphs (droplet / bolt / cross) drawn as vector paths so
// they scale cleanly at any texture resolution ───────────────────────────
function drawDroplet(ctx, cx, cy, s, color) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx, cy - s)
  ctx.bezierCurveTo(cx + s * 0.75, cy - s * 0.1, cx + s * 0.6, cy + s, cx, cy + s)
  ctx.bezierCurveTo(cx - s * 0.6, cy + s, cx - s * 0.75, cy - s * 0.1, cx, cy - s)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawBolt(ctx, cx, cy, s, color) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx + s * 0.15, cy - s)
  ctx.lineTo(cx - s * 0.55, cy + s * 0.15)
  ctx.lineTo(cx - s * 0.05, cy + s * 0.15)
  ctx.lineTo(cx - s * 0.15, cy + s)
  ctx.lineTo(cx + s * 0.55, cy - s * 0.2)
  ctx.lineTo(cx + s * 0.05, cy - s * 0.2)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawCross(ctx, cx, cy, s, color) {
  ctx.save()
  ctx.fillStyle = color
  const arm = s * 0.42
  ctx.beginPath()
  ctx.roundRect(cx - arm * 0.35, cy - arm, arm * 0.7, arm * 2, arm * 0.15)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(cx - arm, cy - arm * 0.35, arm * 2, arm * 0.7, arm * 0.15)
  ctx.fill()
  ctx.restore()
}

// ── Mountain-peak logomark: two overlapping triangles with a bright-to-dark
// gradient, matching the reference mark above the RISE wordmark ─────────
function drawLogomark(ctx, cx, topY, width, height, f) {
  const grad = ctx.createLinearGradient(0, topY, 0, topY + height)
  grad.addColorStop(0, '#EAF6FF')
  grad.addColorStop(0.35, f.accent)
  grad.addColorStop(1, f.accentDark)

  ctx.save()
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(cx, topY)
  ctx.lineTo(cx + width / 2, topY + height)
  ctx.lineTo(cx + width * 0.18, topY + height)
  ctx.lineTo(cx, topY + height * 0.55)
  ctx.lineTo(cx - width * 0.18, topY + height)
  ctx.lineTo(cx - width / 2, topY + height)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = f.accentDark
  ctx.globalAlpha = 0.55
  ctx.beginPath()
  ctx.moveTo(cx, topY + height * 0.55)
  ctx.lineTo(cx + width * 0.18, topY + height)
  ctx.lineTo(cx - width * 0.18, topY + height)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// Deterministic pseudo-random droplet layout shared between the color map
// and the roughness map so the wet-look highlights line up with the
// low-roughness (glossy) spots underneath them.
function generateDroplets(W, H, count) {
  const drops = []
  let seed = 1337
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let i = 0; i < count; i++) {
    drops.push({
      x: rand() * W,
      y: rand() * H,
      rx: 4 + rand() * 10,
      ry: 7 + rand() * 16
    })
  }
  return drops
}

// ── Color/label texture (the printed wrap around the can) ─────────────────
function makeCanTexture(flavorKey, droplets) {
  const f = FLAVORS[flavorKey]
  const c = document.createElement('canvas')
  c.width = 4096
  c.height = 8192
  const ctx = c.getContext('2d')
  const W = c.width, H = c.height

  // 1. Matte black base with a very subtle vertical falloff for depth
  const base = ctx.createLinearGradient(0, 0, 0, H)
  base.addColorStop(0, '#050506')
  base.addColorStop(0.5, '#0c0c0e')
  base.addColorStop(1, '#050506')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, W, H)

  ctx.textAlign = 'center'

  // 2. Top tagline
  ctx.font = '600 34px Helvetica, Arial, sans-serif'
  ctx.fillStyle = f.accent
  ctx.letterSpacing = '10px'
  ctx.fillText('HYDRATE.  FUEL.  ELEVATE.', W / 2, H * 0.075)
  ctx.letterSpacing = '0px'

  // 3. Vertical light-streak accents flanking the wordmark, echoing the
  // thin glowing lines that run down the sides of the reference can
  ctx.save()
  ctx.globalAlpha = 0.8
  const streakXs = [W * 0.20, W * 0.245, W * 0.755, W * 0.80]
  streakXs.forEach((sx, i) => {
    const grad = ctx.createLinearGradient(0, H * 0.10, 0, H * 0.62)
    grad.addColorStop(0, 'rgba(255,255,255,0)')
    grad.addColorStop(0.15, f.accent)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.strokeStyle = grad
    ctx.lineWidth = i % 2 === 0 ? 3 : 1.5
    ctx.beginPath()
    const bow = (i < 2 ? 1 : -1) * W * 0.015
    ctx.moveTo(sx, H * 0.10)
    ctx.quadraticCurveTo(sx + bow, H * 0.36, sx, H * 0.62)
    ctx.stroke()
  })
  ctx.restore()

  // 4. Logomark (mountain peak)
  drawLogomark(ctx, W / 2, H * 0.135, W * 0.22, H * 0.05, f)

  // 6. Sub-line
  ctx.font = '600 50px Helvetica, Arial, sans-serif'
  ctx.fillStyle = f.accent
  ctx.letterSpacing = '4px'
  ctx.fillText('HYDRATION + PERFORMANCE', W / 2, H * 0.355)
  ctx.letterSpacing = '0px'

  // 7. Icon row — Electrolytes / Energy / Vitamins with divider rules
  const iconY = H * 0.415
  const labelY = iconY + 70
  const iconR = 34
  ;[
    { x: W * 0.32, draw: drawDroplet, text: 'ELECTROLYTES' },
    { x: W * 0.50, draw: drawBolt, text: 'ENERGY' },
    { x: W * 0.68, draw: drawCross, text: 'VITAMINS' }
  ].forEach((it) => {
    it.draw(ctx, it.x, iconY, iconR, '#ffffff')
    ctx.font = '600 30px Helvetica, Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.letterSpacing = '1px'
    ctx.fillText(it.text, it.x, labelY)
    ctx.letterSpacing = '0px'
  })
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 2
  ;[0.41, 0.59].forEach((xf) => {
    ctx.beginPath()
    ctx.moveTo(W * xf, iconY - iconR)
    ctx.lineTo(W * xf, iconY + iconR)
    ctx.stroke()
  })

  // 8. RISE wordmark + NO SUGAR line
  ctx.font = '900 320px Helvetica, Arial, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('RISE', W / 2, H * 0.48)
  ctx.font = '700 46px Helvetica, Arial, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.letterSpacing = '2px'
  ctx.fillText('NO SUGAR  ·  NO CRASH', W / 2, H * 0.505)
  ctx.letterSpacing = '0px'

  // 9. Flavor name — the one place the accent color takes center stage
  const flavorSize = f.label.length > 8 ? 96 : 120
  ctx.font = '800 ' + flavorSize + 'px Helvetica, Arial, sans-serif'
  ctx.fillStyle = f.accent
  ctx.fillText(f.label.toUpperCase(), W / 2, H * 0.545)

  // 10. Naturally flavored + volume
  ctx.font = '400 38px Helvetica, Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText('NATURALLY FLAVORED', W / 2, H * 0.575)
  ctx.font = '400 40px Helvetica, Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText('12 FL OZ (355 ML)', W / 2, H * 0.605)

  // 11. Vertical seam line on the back of the can
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(W - 6, 0, 6, H)
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  ctx.fillRect(W - 10, 0, 2, H)

  // 12. Condensation droplets — scattered across the whole can, including
  // over the label, matching the heavily "wet" reference photography
  droplets.forEach((d) => {
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.beginPath()
    ctx.ellipse(d.x, d.y, d.rx, d.ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.beginPath()
    ctx.ellipse(d.x - d.rx * 0.3, d.y - d.ry * 0.35, d.rx * 0.25, d.ry * 0.2, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  return applyTexture(new THREE.CanvasTexture(c))
}

// ── Roughness map for the body: mostly matte, with glossy dips exactly
// where each condensation droplet sits so highlights only appear on the
// "wet" spots — a flat single roughness value would look plastic ────────
function makeBodyRoughnessMap(droplets, W, H) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 2048
  const ctx = c.getContext('2d')
  const sx = c.width / W, sy = c.height / H

  ctx.fillStyle = 'rgb(150,150,150)' // matte base (~0.6 roughness)
  ctx.fillRect(0, 0, c.width, c.height)

  droplets.forEach((d) => {
    const grad = ctx.createRadialGradient(
      d.x * sx, d.y * sy, 0,
      d.x * sx, d.y * sy, Math.max(d.rx, d.ry) * Math.max(sx, sy) * 1.4
    )
    grad.addColorStop(0, 'rgb(40,40,40)')
    grad.addColorStop(1, 'rgb(150,150,150)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(d.x * sx, d.y * sy, d.rx * sx * 1.4, d.ry * sy * 1.4, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.RepeatWrapping
  tex.needsUpdate = true
  return tex
}

// ── Normal map: keeps the label/rim tactility from before ─────────────────
function makeNormalMap() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 2048
  const ctx = c.getContext('2d')
  const W = c.width, H = c.height

  ctx.fillStyle = 'rgb(128,128,255)'
  ctx.fillRect(0, 0, W, H)

  for (let y = 0; y < 60; y += 1) {
    const t = y / 60
    const dx = Math.sin(t * Math.PI) * 30
    ctx.fillStyle = `rgb(${128 + dx},128,${255 - dx * 0.3})`
    ctx.fillRect(0, y, W, 1)
  }
  for (let y = H - 80; y < H; y += 1) {
    const t = (y - (H - 80)) / 80
    const dx = Math.sin(t * Math.PI) * 28
    ctx.fillStyle = `rgb(${128 + dx},128,${255 - dx * 0.3})`
    ctx.fillRect(0, y, W, 1)
  }

  const seam = ctx.createLinearGradient(0, 0, 30, 0)
  seam.addColorStop(0, 'rgb(110,128,255)')
  seam.addColorStop(0.5, 'rgb(128,128,255)')
  seam.addColorStop(1, 'rgb(128,128,255)')
  ctx.fillStyle = seam
  ctx.fillRect(0, 60, 26, H - 140)
  const seamR = ctx.createLinearGradient(W - 30, 0, W, 0)
  seamR.addColorStop(0, 'rgb(128,128,255)')
  seamR.addColorStop(0.5, 'rgb(128,128,255)')
  seamR.addColorStop(1, 'rgb(146,128,255)')
  ctx.fillStyle = seamR
  ctx.fillRect(W - 26, 60, 26, H - 140)

  ctx.font = '900 200px Helvetica, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.strokeStyle = 'rgb(158,128,255)'
  ctx.lineWidth = 12
  ctx.strokeText('RISE', W / 2, 480)
  ctx.strokeStyle = 'rgb(98,128,255)'
  ctx.lineWidth = 2
  ctx.strokeText('RISE', W / 2, 480)

  const data = ctx.getImageData(0, 0, W, H)
  const arr = data.data
  for (let i = 0; i < arr.length; i += 4) {
    const n = (Math.random() - 0.5) * 6
    arr[i] = Math.max(0, Math.min(255, arr[i] + n))
    arr[i + 1] = Math.max(0, Math.min(255, arr[i + 1] + n))
  }
  ctx.putImageData(data, 0, 0)

  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 8
  tex.wrapS = THREE.RepeatWrapping
  tex.needsUpdate = true
  return tex
}

// ── Brushed-aluminum roughness map for the bare metal lid/rim/tab ─────────
function makeBrushedRoughnessMap() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(512, 512)
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4
      const angle = Math.atan2(y - 256, x - 256)
      const streak = Math.sin(angle * 220) * 18
      const noise = (Math.random() - 0.5) * 10
      const v = Math.max(0, Math.min(255, 90 + streak + noise))
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

// ── Closed can body profile (concave bottom, rolled rims, recessed lid) ───
function buildBodyProfile(R, RT, H) {
  const HALF = H / 2
  const domeDepth = 0.16
  const domeRadius = R * 0.82
  const pts = []
  const smooth = (t) => t * t * (3 - 2 * t)

  pts.push(new THREE.Vector2(0, -HALF + domeDepth))
  const domeSeg = 14
  for (let i = 1; i <= domeSeg; i++) {
    const t = smooth(i / domeSeg)
    pts.push(new THREE.Vector2(domeRadius * t, (-HALF + domeDepth) - domeDepth * t))
  }
  pts.push(new THREE.Vector2(R * 0.92, -HALF + domeDepth * 0.06))
  pts.push(new THREE.Vector2(R * 0.985, -HALF + 0.01))
  pts.push(new THREE.Vector2(R, -HALF + 0.06))

  const wallSeg = 40
  const wallTop = HALF - HALF * 0.06
  for (let i = 1; i <= wallSeg; i++) {
    const t = i / wallSeg
    pts.push(new THREE.Vector2(R, (-HALF + 0.06) + (wallTop - (-HALF + 0.06)) * t))
  }

  const neckSeg = 14
  for (let i = 1; i <= neckSeg; i++) {
    const t = smooth(i / neckSeg)
    pts.push(new THREE.Vector2(R - (R - RT) * t, wallTop + (HALF - 0.02 - wallTop) * t))
  }

  pts.push(new THREE.Vector2(RT * 1.01, HALF - 0.005))
  pts.push(new THREE.Vector2(RT * 0.94, HALF + 0.01))

  const lidSeg = 10
  for (let i = 1; i <= lidSeg; i++) {
    const t = smooth(i / lidSeg)
    pts.push(new THREE.Vector2(RT * 0.94 * (1 - t), (HALF + 0.01) - 0.03 * Math.sin(t * Math.PI * 0.5)))
  }
  pts.push(new THREE.Vector2(0, HALF - 0.02))

  return pts
}

// ── Build the can ───────────────────────────────────────────────────────
export function createCan(flavor = 'berry') {
  const group = new THREE.Group()
  const f = FLAVORS[flavor]
  const R = 1.0
  const RT = 0.92
  const H = 3.2
  const HALF = H / 2

  const points = buildBodyProfile(R, RT, H)
  const bodyGeo = new THREE.LatheGeometry(points, 96)
  bodyGeo.computeVertexNormals()

  const TEX_W = 4096, TEX_H = 8192
  const droplets = generateDroplets(TEX_W, TEX_H, 90)

  const bodyTex = makeCanTexture(flavor, droplets)
  bodyTex.wrapS = THREE.RepeatWrapping
  const normalTex = makeNormalMap()
  const bodyRoughTex = makeBodyRoughnessMap(droplets, TEX_W, TEX_H)
  const metalRoughTex = makeBrushedRoughnessMap()

  // Matte-black printed finish: mid metalness (painted aluminum, not bare),
  // high base roughness so the can reads matte, with a thin, low, rough
  // clearcoat rather than a glossy one, per the "premium matte finish"
  // treatment in the reference photos. Glossy droplet highlights come from
  // bodyRoughTex, not from the clearcoat.
  const bodyMat = new THREE.MeshPhysicalMaterial({
    map: bodyTex,
    normalMap: normalTex,
    normalScale: new THREE.Vector2(0.6, 0.6),
    roughnessMap: bodyRoughTex,
    metalness: 0.4,
    roughness: 0.6,
    clearcoat: 0.25,
    clearcoatRoughness: 0.55,
    envMapIntensity: 1.1
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  group.add(body)

  // Score line ring
  const scoreGeo = new THREE.RingGeometry(RT * 0.86, RT * 0.88, 96)
  const scoreMat = new THREE.MeshStandardMaterial({
    color: 0x6a6a72, metalness: 0.7, roughness: 0.6, side: THREE.DoubleSide
  })
  const score = new THREE.Mesh(scoreGeo, scoreMat)
  score.rotation.x = -Math.PI / 2
  score.position.y = HALF - 0.005
  group.add(score)

  // Rivet — tinted slightly toward the flavor accent, like an anodized tab
  const accentColor = new THREE.Color(f.accent)
  const silver = new THREE.Color(0x9a9aa2)
  const tabTint = silver.clone().lerp(accentColor, 0.18)

  const rivetGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16)
  const rivetMat = new THREE.MeshStandardMaterial({
    color: tabTint, metalness: 0.95, roughness: 0.25, roughnessMap: metalRoughTex
  })
  const rivet = new THREE.Mesh(rivetGeo, rivetMat)
  rivet.position.set(0, HALF + 0.01, 0)
  group.add(rivet)

  // Pull tab with a real cut finger-hole
  function makePullTab() {
    const t = new THREE.Shape()
    t.moveTo(-0.05, 0)
    t.lineTo(-0.05, -0.10)
    t.quadraticCurveTo(-0.05, -0.20, 0.10, -0.20)
    t.lineTo(0.50, -0.20)
    t.quadraticCurveTo(0.62, -0.20, 0.62, -0.10)
    t.lineTo(0.62, 0.02)
    t.lineTo(0.50, 0.02)
    t.lineTo(0.10, 0.02)
    t.lineTo(-0.05, 0)

    const hole = new THREE.Path()
    hole.absellipse(0.42, -0.09, 0.09, 0.06, 0, Math.PI * 2, false)
    t.holes.push(hole)

    const geo = new THREE.ExtrudeGeometry(t, {
      depth: 0.015, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2
    })
    geo.computeVertexNormals()
    const mat = new THREE.MeshStandardMaterial({
      color: tabTint, metalness: 0.95, roughness: 0.2, roughnessMap: metalRoughTex
    })
    const m = new THREE.Mesh(geo, mat)
    m.rotation.x = Math.PI / 2
    m.rotation.z = -0.2
    m.position.set(-0.30, HALF + 0.02, 0.4)
    m.userData.mat = mat
    return m
  }
  const pullTab = makePullTab()
  group.add(pullTab)

  group.userData = {
    flavor, body, bodyMat, bodyTex, normalTex, droplets,
    rivetMat, tabMat: pullTab.userData.mat,
    currentFlavor: flavor,
    flavors: FLAVORS
  }
  return group
}

export function setCanFlavor(canGroup, flavor) {
  if (!canGroup || !canGroup.userData) return
  if (canGroup.userData.currentFlavor === flavor) return
  const f = FLAVORS[flavor]

  const newTex = makeCanTexture(flavor, canGroup.userData.droplets)
  canGroup.userData.bodyMat.map = newTex
  canGroup.userData.bodyMat.needsUpdate = true
  canGroup.userData.bodyTex.dispose?.()
  canGroup.userData.bodyTex = newTex

  const accentColor = new THREE.Color(f.accent)
  const silver = new THREE.Color(0x9a9aa2)
  const tabTint = silver.clone().lerp(accentColor, 0.18)
  canGroup.userData.rivetMat.color.copy(tabTint)
  canGroup.userData.tabMat.color.copy(tabTint)

  canGroup.userData.currentFlavor = flavor
}

export function getFlavors() {
  return FLAVORS
}

export function disposeCan(canGroup) {
  if (!canGroup) return
  canGroup.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach((m) => {
        ['map', 'normalMap', 'roughnessMap'].forEach((key) => {
          if (m[key]) m[key].dispose()
        })
        m.dispose()
      })
    }
  })
}