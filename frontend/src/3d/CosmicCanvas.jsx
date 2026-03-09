import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Preload } from '@react-three/drei';
import StarField from './StarField';
import ZodiacWheel from './ZodiacWheel';
import SolarSystem from './SolarSystem';

export default function CosmicCanvas() {
    return (
        <div className="canvas-container">
            <Canvas
                camera={{ position: [0, 8, 20], fov: 60, near: 0.1, far: 1000 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    {/* Ambient and directional light */}
                    <ambientLight intensity={0.3} color="#1a0533" />
                    <directionalLight position={[10, 10, 5]} intensity={0.5} color="#c4b5fd" />

                    {/* 3D Scene layers */}
                    <StarField />
                    <ZodiacWheel />
                    <SolarSystem />

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
