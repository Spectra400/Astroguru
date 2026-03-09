import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

export default function StarField() {
    const ref = useRef();

    const positions = useMemo(() => {
        const arr = new Float32Array(10000 * 3);
        for (let i = 0; i < 10000; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 300;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 300;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 300;
        }
        return arr;
    }, []);

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 25;
            ref.current.rotation.y -= delta / 30;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 5]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#c4b5fd"
                    size={0.18}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
}
