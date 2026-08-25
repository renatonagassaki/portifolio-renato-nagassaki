import { useEffect, useRef } from 'react'

/**
 * Wrapper genérico que monta uma cena three.js (função factory que recebe
 * o container e devolve uma função de destroy) dentro de uma div e cuida
 * do ciclo de vida / cleanup.
 */
export default function Canvas3D({ sceneFactory, className }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const destroy = sceneFactory(ref.current)
    return () => destroy && destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={ref} className={className} aria-hidden="true" />
}
