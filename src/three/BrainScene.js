import * as THREE from 'three'

/**
 * Cena 3D "cérebro digital": nuvem de pontos organizada em duas esferas
 * lobuladas conectadas por linhas finas, simulando uma rede neural,
 * pulsando suavemente sobre um disco/plataforma de base.
 */
export function createBrainScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0.3, 6.5)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  const group = new THREE.Group()
  scene.add(group)

  // Gera pontos em formato de "cérebro" (duas esferas ligeiramente deformadas)
  const nodeCount = 420
  const nodePositions = []
  for (let i = 0; i < nodeCount; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const r = 1.15 + Math.random() * 0.35
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    let x = r * Math.sin(phi) * Math.cos(theta) * 0.85 + side * 0.35
    let y = r * Math.sin(phi) * Math.sin(theta) * 0.95
    let z = r * Math.cos(phi) * 0.85
    // achata levemente no eixo z para lembrar um cérebro visto de frente
    z *= 0.7
    nodePositions.push(new THREE.Vector3(x, y, z))
  }

  const posArray = new Float32Array(nodeCount * 3)
  nodePositions.forEach((v, i) => {
    posArray[i * 3] = v.x
    posArray[i * 3 + 1] = v.y
    posArray[i * 3 + 2] = v.z
  })
  const nodesGeo = new THREE.BufferGeometry()
  nodesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  const nodesMat = new THREE.PointsMaterial({
    color: 0x9b8bff,
    size: 0.045,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  })
  const nodes = new THREE.Points(nodesGeo, nodesMat)
  group.add(nodes)

  // Linhas de conexão entre pontos próximos (efeito rede neural)
  const lineVerts = []
  const maxDist = 0.55
  for (let i = 0; i < nodePositions.length; i += 3) {
    for (let j = i + 1; j < Math.min(i + 12, nodePositions.length); j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < maxDist) {
        lineVerts.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z)
        lineVerts.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z)
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3))
  const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.18 })
  const lines = new THREE.LineSegments(lineGeo, lineMat)
  group.add(lines)

  // Plataforma/disco de base
  const diskGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.04, 64, 1, true)
  const diskMat = new THREE.MeshBasicMaterial({ color: 0x6d4bff, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
  const disk = new THREE.Mesh(diskGeo, diskMat)
  disk.position.y = -1.7
  scene.add(disk)

  const ringGeo = new THREE.RingGeometry(1.6, 2.1, 64)
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = -1.7
  scene.add(ring)

  let frameId
  const clock = new THREE.Clock()

  function animate() {
    const t = clock.getElapsedTime()
    group.rotation.y = t * 0.22
    group.position.y = Math.sin(t * 0.8) * 0.06
    nodesMat.opacity = 0.65 + Math.sin(t * 1.4) * 0.2
    ring.rotation.z = t * 0.15
    renderer.render(scene, camera)
    frameId = requestAnimationFrame(animate)
  }
  animate()

  function onResize() {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  return function destroy() {
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
    nodesGeo.dispose(); nodesMat.dispose()
    lineGeo.dispose(); lineMat.dispose()
    diskGeo.dispose(); diskMat.dispose()
    ringGeo.dispose(); ringMat.dispose()
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement)
    }
  }
}
