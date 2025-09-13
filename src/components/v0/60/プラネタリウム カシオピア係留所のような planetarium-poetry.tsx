"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function PlanetariumPoetry() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		if (!canvasRef.current || loaded) return

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		)
		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			alpha: true
		})
		renderer.setSize(window.innerWidth, window.innerHeight)

		const controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		controls.dampingFactor = 0.05

		const geometry = new THREE.SphereGeometry(5, 32, 32)
		const material = new THREE.MeshBasicMaterial({
			color: 0x000000,
			side: THREE.BackSide
		})
		const sphere = new THREE.Mesh(geometry, material)
		scene.add(sphere)

		camera.position.z = 3

		const poems = [
			"星空の下\n夢見る心は\n無限大",
			"月の光\n静かに照らす\n君の顔",
			"銀河の中\n私たちの星\n輝いて"
		]

		const createTextTexture = (text: string) => {
			const canvas = document.createElement("canvas")
			const ctx = canvas.getContext("2d")
			if (!ctx) return null

			canvas.width = 512
			canvas.height = 512
			ctx.fillStyle = "black"
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			ctx.font = "24px serif"
			ctx.fillStyle = "white"
			ctx.textAlign = "center"
			ctx.textBaseline = "middle"

			const lines = text.split("\n")
			lines.forEach((line, index) => {
				ctx.fillText(line, canvas.width / 2, (index + 1) * 30)
			})

			return new THREE.CanvasTexture(canvas)
		}

		const textMeshes: THREE.Mesh[] = []

		poems.forEach((poem, index) => {
			const texture = createTextTexture(poem)
			if (!texture) return

			const textGeometry = new THREE.PlaneGeometry(2, 2)
			const textMaterial = new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true,
				side: THREE.DoubleSide
			})
			const textMesh = new THREE.Mesh(textGeometry, textMaterial)

			const angle = (index / poems.length) * Math.PI * 2
			textMesh.position.set(Math.cos(angle) * 4, Math.sin(angle) * 4, 0)
			textMesh.lookAt(0, 0, 0)

			scene.add(textMesh)
			textMeshes.push(textMesh)
		})

		// 画像の追加
		const loader = new THREE.TextureLoader()
		const imageGeometry = new THREE.PlaneGeometry(1, 1)
		const imageMaterial = new THREE.MeshBasicMaterial({
			map: loader.load("/placeholder.svg?height=256&width=256"),
			transparent: true,
			side: THREE.DoubleSide
		})
		const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial)
		imageMesh.position.set(0, 3, 0)
		imageMesh.lookAt(0, 0, 0)
		scene.add(imageMesh)

		const animate = () => {
			requestAnimationFrame(animate)
			controls.update()

			textMeshes.forEach((mesh, index) => {
				const time = Date.now() * 0.001
				const angle =
					((index / poems.length) * Math.PI * 2 + time * 0.1) % (Math.PI * 2)
				mesh.position.set(Math.cos(angle) * 4, Math.sin(angle) * 4, 0)
				mesh.lookAt(0, 0, 0)
			})

			renderer.render(scene, camera)
		}

		animate()

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()
			renderer.setSize(window.innerWidth, window.innerHeight)
		}

		window.addEventListener("resize", handleResize)

		setLoaded(true)

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [loaded])

	return (
		<div className='w-full h-screen bg-black'>
			<canvas ref={canvasRef} className='w-full h-full' />
		</div>
	)
}
