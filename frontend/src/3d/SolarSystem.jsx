import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const PLANETS = [
    { name: 'Mercury', radius: 2.5, size: 0.08, speed: 1.6, color: '#a78bfa', emissive: '#7c3aed' },
    { name: 'Venus', radius: 3.5, size: 0.12, speed: 1.2, color: '#fbbf24', emissive: '#f59e0b' },
    { name: 'Earth', radius: 4.8, size: 0.14, speed: 1.0, color: '#34d399', emissive: '#059669' },
    { name: 'Mars', radius: 6.2, size: 0.10, speed: 0.8, color: '#f87171', emissive: '#dc2626' },
    { name: 'Jupiter', radius: 8.0, size: 0.22, speed: 0.5, color: '#fed7aa', emissive: '#f97316' },
    { name: 'Saturn', radius: 9.8, size: 0.18, speed: 0.3, color: '#fde68a', emissive: '#d97706' },
    { name: 'Ketu', radius: 11.5, size: 0.09, speed: 0.2, color: '#c4b5fd', emissive: '#8b5cf6' },
];

function Planet({ config }) {
    const meshRef = useRef();
    const angleRef = useRef(Math.random() * Math.PI * 2);

    useFrame((_, delta) => {
        angleRef.current += delta * config.speed * 0.4;
        if (meshRef.current) {
            meshRef.current.position.x = Math.cos(angleRef.current) * config.radius;
            meshRef.current.position.z = Math.sin(angleRef.current) * config.radius;
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[config.size, 16, 16]} />
            <meshStandardMaterial
                color={config.color}
                emissive={config.emissive}
                emissiveIntensity={1.5}
            />
        </mesh>
    );
}

function OrbitRing({ radius }) {
    const points = [];
    for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return (
        <line geometry={geometry}>
            <lineBasicMaterial color="#7c3aed" opacity={0.12} transparent />
        </line>
    );
}

export default function SolarSystem() {
    return (
        <group position={[0, 0, 0]}>
            {/* Sun */}
            <mesh>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={3} />
            </mesh>

            {/* Sun glow lights */}
            <pointLight color="#f59e0b" intensity={8} distance={20} />
            <pointLight color="#fde68a" intensity={3} distance={40} />

            {/* Orbit rings */}
            {PLANETS.map((p) => <OrbitRing key={`orbit-${p.name}`} radius={p.radius} />)}

            {/* Planets */}
            {PLANETS.map((p) => <Planet key={p.name} config={p} />)}
        </group>
    );
}
