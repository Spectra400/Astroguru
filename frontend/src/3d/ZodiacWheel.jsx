import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Torus, Line } from '@react-three/drei';
import * as THREE from 'three';

const ZODIAC_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export default function ZodiacWheel() {
    const groupRef = useRef();
    const innerRef = useRef();

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.06;
        if (innerRef.current) innerRef.current.rotation.y -= delta * 0.1;
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Outer glowing ring */}
            <Torus args={[5.5, 0.03, 16, 128]}>
                <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2} />
            </Torus>

            {/* Inner ring */}
            <Torus args={[4.5, 0.02, 16, 128]}>
                <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} />
            </Torus>

            {/* Divider spokes */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const x1 = Math.cos(angle) * 4.5;
                const y1 = Math.sin(angle) * 4.5;
                const x2 = Math.cos(angle) * 5.5;
                const y2 = Math.sin(angle) * 5.5;
                return (
                    <Line key={`spoke-${i}`}
                        points={[[x1, y1, 0], [x2, y2, 0]]}
                        color="#7c3aed" lineWidth={1} opacity={0.5} transparent />
                );
            })}

            {/* Zodiac glyphs */}
            {ZODIAC_GLYPHS.map((glyph, i) => {
                const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                const r = 5.0;
                return (
                    <group key={`zodiac-${i}`}
                        position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}>
                        <Text fontSize={0.55} color="#e9d5ff" anchorX="center" anchorY="middle"
                            outlineColor="#7c3aed" outlineWidth={0.02}>
                            {glyph}
                        </Text>
                    </group>
                );
            })}

            {/* Central point light for bloom effect */}
            <pointLight color="#7c3aed" intensity={2} distance={15} />
        </group>
    );
}
