import * as THREE from 'three'

/**
 * Cena 3D "avatar digital": busto humano ultra-realista como nuvem de partículas
 * com anatomia detalhada - crânio, face, pescoço, ombros e peito
 */
export function createAvatarScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0.15, 5.5)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  const group = new THREE.Group()
  scene.add(group)

  // ============ GERAÇÃO DE PARTÍCULAS DO BUSTO HUMANO ============
  const points = []
  const pointColors = []

  // Função helper para adicionar ponto com cor
  function addPoint(x, y, z, colorVariant = 0) {
    points.push(new THREE.Vector3(x, y, z))
    
    // Variação de cor baseada na posição (mais realista)
    const baseColor = new THREE.Color(0x8b93ff)
    const highlightColor = new THREE.Color(0x9b8bff)
    const shadowColor = new THREE.Color(0x6d4bff)
    
    if (colorVariant < 0.3) {
      pointColors.push(shadowColor)
    } else if (colorVariant < 0.7) {
      pointColors.push(baseColor)
    } else {
      pointColors.push(highlightColor)
    }
  }

  // ============ 1. CRÂNIO (CABEÇA) ============
  // Formato oval mais realista (não esfera perfeita)
  const headCount = 500
  for (let i = 0; i < headCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    
    // Crânio: levemente alongado verticalmente
    const skullRx = 0.72  // Largura
    const skullRy = 0.85  // Altura (mais alto que largo)
    const skullRz = 0.75  // Profundidade
    
    const x = skullRx * Math.sin(phi) * Math.cos(theta)
    const y = skullRy * Math.sin(phi) * Math.sin(theta) + 0.85
    const z = skullRz * Math.cos(phi)
    
    // Adiciona variação de cor baseada na posição
    const colorVariant = Math.random()
    addPoint(x, y, z, colorVariant)
  }

  // ============ 2. FACE (DETALHES FACIAIS) ============
  // Concentração de pontos na região frontal para simular face
  const faceCount = 150
  for (let i = 0; i < faceCount; i++) {
    // Frente do rosto (z positivo)
    const theta = (Math.random() - 0.5) * 1.5  // Ângulo frontal
    const phi = (Math.random() - 0.3) * 1.2    // Área central
    const r = 0.72
    
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta) + 0.8
    const z = r * Math.cos(phi) * 0.75 + 0.1  // Levemente para frente
    
    if (z > 0.3) {  // Só adiciona se estiver na frente
      addPoint(x, y, z, Math.random() * 0.5 + 0.5)  // Mais brilhante
    }
  }

  // ============ 3. OLHOS (CONCENTRAÇÃO DE PONTOS) ============
  const eyeCount = 40
  for (let i = 0; i < eyeCount; i++) {
    const eye = i % 2 === 0 ? -1 : 1  // Olho esquerdo/direito
    
    // Posição aproximada dos olhos
    const eyeX = eye * 0.25 + (Math.random() - 0.5) * 0.12
    const eyeY = 0.95 + (Math.random() - 0.5) * 0.08
    const eyeZ = 0.55 + Math.random() * 0.15
    
    // Cor mais brilhante para os olhos
    addPoint(eyeX, eyeY, eyeZ, 0.9)
  }

  // ============ 4. NARIZ ============
  const noseCount = 30
  for (let i = 0; i < noseCount; i++) {
    const noseX = (Math.random() - 0.5) * 0.1
    const noseY = 0.7 + (Math.random() - 0.5) * 0.15
    const noseZ = 0.6 + Math.random() * 0.2
    
    addPoint(noseX, noseY, noseZ, 0.75)
  }

  // ============ 5. BOCA ============
  const mouthCount = 25
  for (let i = 0; i < mouthCount; i++) {
    const mouthX = (Math.random() - 0.5) * 0.25
    const mouthY = 0.55 + (Math.random() - 0.5) * 0.05
    const mouthZ = 0.58 + Math.random() * 0.15
    
    addPoint(mouthX, mouthY, mouthZ, 0.6)
  }

  // ============ 6. PESCOÇO ============
  const neckCount = 200
  for (let i = 0; i < neckCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = 0.3 + Math.random() * 0.1
    const y = 0.15 + Math.random() * 0.35
    
    const x = r * Math.cos(angle)
    const z = r * Math.sin(angle)
    
    addPoint(x, y, z, Math.random() * 0.4 + 0.3)
  }

  // ============ 7. OMBROS ============
  const shoulderCount = 400
  for (let i = 0; i < shoulderCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const y = -0.25 - Math.random() * 0.6
    
    // Ombros mais largos na frente
    const spreadBase = 0.9 + Math.sin(angle) * 0.2
    const spread = spreadBase * (1 - (y + 0.85) * -0.7)
    const r = spread * (0.8 + Math.random() * 0.4)
    
    const x = r * Math.cos(angle)
    const z = r * Math.sin(angle) * 0.7  // Mais achatado
    
    addPoint(x, y, z, Math.random() * 0.6 + 0.2)
  }

  // ============ 8. PEITO / TÓRAX ============
  const chestCount = 300
  for (let i = 0; i < chestCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const y = -0.8 - Math.random() * 0.7
    
    // Peito mais largo que ombros
    const chestWidth = 1.2 * (1 - (y + 1.5) * -0.5)
    const r = chestWidth * (0.7 + Math.random() * 0.4)
    
    const x = r * Math.cos(angle)
    const z = r * Math.sin(angle) * 0.65
    
    // Peitoral mais definido na frente
    if (Math.abs(angle) < 1) {
      addPoint(x, y, z + 0.1, 0.7)
    } else {
      addPoint(x, y, z, 0.3)
    }
  }

  // ============ 9. CLAVÍCULAS (DETALHE) ============
  const clavicleCount = 60
  for (let i = 0; i < clavicleCount; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const clavX = side * (0.15 + Math.random() * 0.5)
    const clavY = -0.1 + Math.random() * 0.05
    const clavZ = 0.2 + Math.random() * 0.3
    
    addPoint(clavX, clavY, clavZ, 0.65)
  }

  // ============ 10. TRAPÉZIOS (MÚSCULOS DO PESCOÇO) ============
  const trapeziusCount = 80
  for (let i = 0; i < trapeziusCount; i++) {
    const angle = (Math.random() - 0.5) * 2  // Frente e laterais
    const y = -0.3 - Math.random() * 0.4
    const r = 0.5 + Math.random() * 0.3
    
    const x = r * Math.sin(angle)
    const z = r * Math.cos(angle) * 0.7
    
    addPoint(x, y, z, 0.45)
  }

  // Cria a geometria com cores
  const posArray = new Float32Array(points.length * 3)
  const colorArray = new Float32Array(points.length * 3)
  
  points.forEach((v, i) => {
    posArray[i * 3] = v.x
    posArray[i * 3 + 1] = v.y
    posArray[i * 3 + 2] = v.z
    
    const color = pointColors[i] || new THREE.Color(0x8b93ff)
    colorArray[i * 3] = color.r
    colorArray[i * 3 + 1] = color.g
    colorArray[i * 3 + 2] = color.b
  })
  
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
  
  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,  // Usa cores individuais
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  })
  
  const bust = new THREE.Points(geo, mat)
  group.add(bust)

  // ============ DETALHES ADICIONAIS ============
  
  // Aura/brilho ao redor da cabeça
  const auraGeo = new THREE.SphereGeometry(0.85, 16, 16)
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0x7c5cff,
    transparent: true,
    opacity: 0.05,
    wireframe: true,
  })
  const aura = new THREE.Mesh(auraGeo, auraMat)
  aura.position.y = 0.85
  group.add(aura)

  // Anéis orbitais ao redor do busto
  const ringGeo = new THREE.TorusGeometry(1.7, 0.005, 8, 96)
  const ring1 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ 
    color: 0x9b8bff, 
    transparent: true, 
    opacity: 0.4 
  }))
  ring1.rotation.x = Math.PI / 2.2
  ring1.position.y = 0.2
  group.add(ring1)

  const ring2 = new THREE.Mesh(ringGeo.clone(), new THREE.MeshBasicMaterial({ 
    color: 0x38bdf8, 
    transparent: true, 
    opacity: 0.25 
  }))
  ring2.rotation.x = Math.PI / 1.7
  ring2.rotation.y = Math.PI / 5
  ring2.rotation.z = Math.PI / 6
  ring2.scale.setScalar(1.25)
  group.add(ring2)

  // Linhas de energia subindo (efeito digital)
  const energyLinesCount = 12
  const energyLines = []
  for (let i = 0; i < energyLinesCount; i++) {
    const angle = (i / energyLinesCount) * Math.PI * 2
    const lineGeo = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9,
      Math.cos(angle) * 0.7, 1.4, Math.sin(angle) * 0.7,
      Math.cos(angle + 0.2) * 0.6, 2.0, Math.sin(angle + 0.2) * 0.6,
    ])
    lineGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
    })
    const line = new THREE.Line(lineGeo, lineMat)
    group.add(line)
    energyLines.push(line)
  }

  // Pedestal
  const baseGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.06, 48)
  const baseMat = new THREE.MeshBasicMaterial({ 
    color: 0x6d4bff, 
    transparent: true, 
    opacity: 0.18 
  })
  const base = new THREE.Mesh(baseGeo, baseMat)
  base.position.y = -1.75
  scene.add(base)

  // Anel do pedestal
  const baseRingGeo = new THREE.TorusGeometry(1.1, 0.01, 8, 64)
  const baseRing = new THREE.Mesh(baseRingGeo, new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.15,
  }))
  baseRing.rotation.x = -Math.PI / 2
  baseRing.position.y = -1.72
  scene.add(baseRing)

  // ============ ANIMAÇÃO ============
  let frameId
  const clock = new THREE.Clock()

  function animate() {
    const t = clock.getElapsedTime()
    
    // Rotação suave do busto
    group.rotation.y = t * 0.2
    
    // Movimento sutil da cabeça (como se estivesse respirando)
    bust.rotation.y = Math.sin(t * 0.4) * 0.05
    bust.position.y = Math.sin(t * 0.8) * 0.03  // Respiração
    
    // Anéis girando
    ring1.rotation.z = t * 0.3
    ring2.rotation.z = -t * 0.22 + Math.PI / 6
    
    // Aura pulsando
    aura.scale.setScalar(1 + Math.sin(t * 2) * 0.05)
    auraMat.opacity = 0.05 + Math.sin(t * 1.5) * 0.03
    
    // Linhas de energia pulsando
    energyLines.forEach((line, i) => {
      line.material.opacity = 0.1 + Math.sin(t * 2 + i * 0.5) * 0.15
    })
    
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
    geo.dispose()
    mat.dispose()
    auraGeo.dispose()
    auraMat.dispose()
    ringGeo.dispose()
    baseGeo.dispose()
    baseMat.dispose()
    baseRingGeo.dispose()
    
    energyLines.forEach(line => {
      line.geometry.dispose()
      line.material.dispose()
    })
    
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement)
    }
  }
}