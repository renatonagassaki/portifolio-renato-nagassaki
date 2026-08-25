import * as THREE from 'three'

/**
 * Cena 3D do Hero: Globo de rede neural global
 * - Esfera com pontos conectados (como internet global)
 * - Linhas animadas entre continentes
 * - Pulsos de dados viajando pelas conexões
 * - Pontos de "alertas" acendendo em locais aleatórios
 */
export function createHeroScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0.2, 7)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // Grupo principal que vai girar
  const globeGroup = new THREE.Group()
  scene.add(globeGroup)

  // ============ 1. ESFERA PRINCIPAL (WIREFRAME) ============
  const sphereGeo = new THREE.SphereGeometry(1.8, 32, 32)
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x7c5cff,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  })
  const sphere = new THREE.Mesh(sphereGeo, sphereMat)
  globeGroup.add(sphere)

  // Esfera interna mais sólida
  const innerSphereGeo = new THREE.SphereGeometry(1.75, 32, 32)
  const innerSphereMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.04,
  })
  const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat)
  globeGroup.add(innerSphere)

  // ============ 2. PONTOS NA SUPERFÍCIE (NÓS DA REDE) ============
  const nodeCount = 180
  const nodePositions = []
  const nodeColors = []
  
  // Distribui pontos na superfície da esfera (como cidades/conexões)
  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 1.8
    
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)
    
    nodePositions.push(new THREE.Vector3(x, y, z))
    
    // Cores variadas para os nós
    const colorChoice = Math.random()
    if (colorChoice < 0.6) {
      nodeColors.push(0x9b8bff) // Roxo claro
    } else if (colorChoice < 0.85) {
      nodeColors.push(0x38bdf8) // Azul
    } else {
      nodeColors.push(0x4ade80) // Verde (nós mais importantes)
    }
  }

  // Cria os pontos (nós)
  const nodeGeo = new THREE.BufferGeometry()
  const nodePosArray = new Float32Array(nodePositions.length * 3)
  const nodeColorArray = new Float32Array(nodePositions.length * 3)
  
  nodePositions.forEach((v, i) => {
    nodePosArray[i * 3] = v.x
    nodePosArray[i * 3 + 1] = v.y
    nodePosArray[i * 3 + 2] = v.z
    
    const color = new THREE.Color(nodeColors[i])
    nodeColorArray[i * 3] = color.r
    nodeColorArray[i * 3 + 1] = color.g
    nodeColorArray[i * 3 + 2] = color.b
  })
  
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArray, 3))
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColorArray, 3))
  
  const nodeMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  })
  
  const nodes = new THREE.Points(nodeGeo, nodeMat)
  globeGroup.add(nodes)

  // ============ 3. LINHAS DE CONEXÃO ENTRE PONTOS PRÓXIMOS ============
  const connectionLines = []
  const maxConnectionDist = 1.2
  
  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      const dist = nodePositions[i].distanceTo(nodePositions[j])
      if (dist < maxConnectionDist) {
        connectionLines.push({
          start: nodePositions[i],
          end: nodePositions[j],
          distance: dist
        })
      }
    }
  }

  // Cria geometria das linhas
  const lineVertices = []
  connectionLines.forEach(conn => {
    lineVertices.push(conn.start.x, conn.start.y, conn.start.z)
    lineVertices.push(conn.end.x, conn.end.y, conn.end.z)
  })
  
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVertices), 3))
  
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x7c5cff,
    transparent: true,
    opacity: 0.25,
    linewidth: 1,
  })
  
  const lines = new THREE.LineSegments(lineGeo, lineMat)
  globeGroup.add(lines)

  // ============ 4. PULSOS DE DADOS VIAJANDO ============
  const pulseCount = 25
  const pulses = []
  
  for (let i = 0; i < pulseCount; i++) {
    // Seleciona uma conexão aleatória para o pulso viajar
    const connection = connectionLines[Math.floor(Math.random() * connectionLines.length)]
    
    const pulseGeo = new THREE.SphereGeometry(0.035, 8, 8)
    const pulseMat = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0x38bdf8 : 0x9b8bff,
      transparent: true,
      opacity: 0.9,
    })
    
    const pulse = new THREE.Mesh(pulseGeo, pulseMat)
    
    // Posição inicial
    pulse.userData = {
      start: connection.start.clone(),
      end: connection.end.clone(),
      progress: Math.random(), // Começa em posição aleatória
      speed: 0.3 + Math.random() * 0.7, // Velocidade variada
      connectionIndex: connectionLines.indexOf(connection),
    }
    
    pulse.position.copy(pulse.userData.start)
    globeGroup.add(pulse)
    pulses.push(pulse)
  }

  // ============ 5. PONTOS DE ALERTA ============
  const alertCount = 8
  const alerts = []
  
  for (let i = 0; i < alertCount; i++) {
    const alertGeo = new THREE.SphereGeometry(0.06, 8, 8)
    const alertMat = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0,
    })
    
    const alert = new THREE.Mesh(alertGeo, alertMat)
    
    // Posição aleatória na esfera
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    alert.position.set(
      1.8 * Math.sin(phi) * Math.cos(theta),
      1.8 * Math.sin(phi) * Math.sin(theta),
      1.8 * Math.cos(phi)
    )
    
    alert.userData = {
      phase: Math.random() * Math.PI * 2, // Fase aleatória
      speed: 0.5 + Math.random() * 1.5,
      active: Math.random() > 0.5, // Alguns já começam ativos
    }
    
    globeGroup.add(alert)
    alerts.push(alert)
  }

  // ============ 6. ANÉIS ORBITAIS EXTERNOS ============
  const ringGeo = new THREE.TorusGeometry(2.6, 0.008, 8, 128)
  const ringMat = new THREE.MeshBasicMaterial({ 
    color: 0x9b8bff, 
    transparent: true, 
    opacity: 0.3 
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = Math.PI / 2.5
  scene.add(ring)

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.0, 0.004, 8, 128),
    new THREE.MeshBasicMaterial({ 
      color: 0x38bdf8, 
      transparent: true, 
      opacity: 0.2 
    })
  )
  ring2.rotation.x = Math.PI / 1.7
  ring2.rotation.y = Math.PI / 5
  ring2.scale.setScalar(1.15)
  scene.add(ring2)

  // ============ 7. PARTÍCULAS DE FUNDO ============
  const particleCount = 150
  const particlePositions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    const r = 3.5 + Math.random() * 2.5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    particlePositions[i * 3 + 2] = r * Math.cos(phi)
  }
  
  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  
  const particleMat = new THREE.PointsMaterial({
    color: 0x9b8bff,
    size: 0.02,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  })
  
  const particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)

  // ============ ANIMAÇÃO ============
  let frameId
  let mouseX = 0
  let mouseY = 0

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect()
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  }
  window.addEventListener('mousemove', onMouseMove)

  const clock = new THREE.Clock()

  function animate() {
    const t = clock.getElapsedTime()
    
    // Rotação do globo
    globeGroup.rotation.y = t * 0.15 + mouseX * 0.4
    globeGroup.rotation.x = Math.sin(t * 0.1) * 0.1 + mouseY * 0.2
    
    // Anéis orbitais
    ring.rotation.z = t * 0.1
    ring2.rotation.z = -t * 0.08
    
    // Partículas de fundo
    particles.rotation.y = t * 0.02
    particles.rotation.x = t * 0.01
    
    // Anima os pulsos de dados
    pulses.forEach((pulse, index) => {
      pulse.userData.progress += pulse.userData.speed * 0.005
      
      if (pulse.userData.progress >= 1) {
        // Reinicia em outra conexão
        const connection = connectionLines[Math.floor(Math.random() * connectionLines.length)]
        pulse.userData.start = connection.start.clone()
        pulse.userData.end = connection.end.clone()
        pulse.userData.progress = 0
        pulse.userData.connectionIndex = connectionLines.indexOf(connection)
      }
      
      // Interpola entre início e fim
      const start = pulse.userData.start
      const end = pulse.userData.end
      const p = pulse.userData.progress
      
      pulse.position.lerpVectors(start, end, p)
      
      // Pulsação do tamanho
      const scale = 1 + Math.sin(t * 5 + index) * 0.3
      pulse.scale.setScalar(scale)
    })
    
    // Anima os alertas
    alerts.forEach(alert => {
      const data = alert.userData
      
      // Ciclo de alerta: fade in -> pisca -> fade out
      const cycle = (t * data.speed + data.phase) % (Math.PI * 2)
      
      if (cycle < Math.PI) {
        // Ativo
        const intensity = Math.sin(cycle) * Math.sin(cycle * 3)
        alert.material.opacity = Math.max(0, intensity * 0.8)
        alert.scale.setScalar(1 + intensity * 0.5)
      } else {
        // Inativo
        alert.material.opacity = 0
        alert.scale.setScalar(1)
      }
    })
    
    renderer.render(scene, camera)
    frameId = requestAnimationFrame(animate)
  }
  
  animate()

  // ============ RESIZE ============
  function onResize() {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  // ============ CLEANUP ============
  return function destroy() {
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onMouseMove)
    
    renderer.dispose()
    
    // Limpa geometrias e materiais
    sphereGeo.dispose()
    sphereMat.dispose()
    innerSphereGeo.dispose()
    innerSphereMat.dispose()
    nodeGeo.dispose()
    nodeMat.dispose()
    lineGeo.dispose()
    lineMat.dispose()
    ringGeo.dispose()
    ringMat.dispose()
    particleGeo.dispose()
    particleMat.dispose()
    
    // Limpa pulsos
    pulses.forEach(pulse => {
      pulse.geometry.dispose()
      pulse.material.dispose()
    })
    
    // Limpa alertas
    alerts.forEach(alert => {
      alert.geometry.dispose()
      alert.material.dispose()
    })
    
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement)
    }
  }
}