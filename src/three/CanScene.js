import * as THREE from 'three'
import { createCan, setCanFlavor } from './CanModel.js'

export class CanScene {
  constructor(container) {
    this.container = container
    this.width = container.clientWidth
    this.height = container.clientHeight

    this.scene = new THREE.Scene()
    this.scene.background = null

    this.camera = new THREE.PerspectiveCamera(38, this.width / this.height, 0.1, 100)
    this.camera.position.set(0, 0, 7)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.outputEncoding = THREE.sRGBEncoding
    container.appendChild(this.renderer.domElement)

    this.ambient = new THREE.AmbientLight(0xffffff, 0.55)
    this.scene.add(this.ambient)

    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.6)
    this.keyLight.position.set(4, 5, 6)
    this.scene.add(this.keyLight)

    this.fillLight = new THREE.DirectionalLight(0x88aaff, 0.6)
    this.fillLight.position.set(-5, 2, 3)
    this.scene.add(this.fillLight)

    this.rimLight = new THREE.DirectionalLight(0xffffff, 1.2)
    this.rimLight.position.set(-2, -3, -4)
    this.scene.add(this.rimLight)

    this.accentLight = new THREE.PointLight(0xD72E4E, 1.4, 14)
    this.accentLight.position.set(0, 0, 3)
    this.scene.add(this.accentLight)

    this.canGroup = createCan('berry')
    this.canGroup.scale.setScalar(1.05)
    this.canGroup.rotation.y = Math.PI
    this.scene.add(this.canGroup)

    this.targetRotX = 0
    this.targetRotY = 0
    this.spinY = 0
    this.mouseX = 0
    this.mouseY = 0
    this.lerpRotX = 0
    this.lerpRotY = 0

    this._onResize = this.onResize.bind(this)
    this._onMouse = this.onMouse.bind(this)
    window.addEventListener('resize', this._onResize)
    window.addEventListener('mousemove', this._onMouse)

    this.clock = new THREE.Clock()
    this.running = true
    this.animate = this.animate.bind(this)
    requestAnimationFrame(this.animate)

    this.updateAccent('#D72E4E')
  }

  updateAccent(hex) {
    const color = new THREE.Color(hex)
    this.accentLight.color = color
    document.documentElement.style.setProperty('--accent', hex)
  }

  setFlavor(key) {
    setCanFlavor(this.canGroup, key)
    const colors = {
      berry: '#990F4B',
      lime: '#32CD32',
      mango: '#F4BB44',
      blue: '#0000FF'
    }
    this.updateAccent(colors[key] || '#990F4B')
  }

  setRotation(y) {
    this.spinY = y
  }

  onMouse(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    this.mouseX = x
    this.mouseY = y
    this.targetRotY = x * 0.18
    this.targetRotX = -y * 0.12
  }

  onResize() {
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  animate() {
    if (!this.running) return
    const t = this.clock.getElapsedTime()
    this.lerpRotX += (this.targetRotX - this.lerpRotX) * 0.06
    this.lerpRotY += (this.targetRotY - this.lerpRotY) * 0.06

    this.canGroup.rotation.x = this.lerpRotX + Math.sin(t * 0.6) * 0.04
    this.canGroup.rotation.y = Math.PI + this.spinY + this.lerpRotY

    this.canGroup.position.y = Math.sin(t * 0.8) * 0.08

    this.keyLight.position.x = 4 + this.mouseX * 2
    this.keyLight.position.y = 5 + this.mouseY * 1.5

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate)
  }

  dispose() {
    this.running = false
    window.removeEventListener('resize', this._onResize)
    window.removeEventListener('mousemove', this._onMouse)
    this.renderer.dispose()
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }
  }
}
